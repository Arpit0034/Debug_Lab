#!/usr/bin/env python3
# Trace a Python solution under the driver and emit a JSON snapshot.
#
# What the trace is meant for: helping a learner "dry run on paper". So the tracer
#   * hides interpreter noise (generator/comprehension frames, GeneratorExit, function objects, addresses),
#   * collapses repetitive setup work (array init, adjacency-list building) to a few visible steps,
#   * records, for every executed line, what it is (check / loop / assign / return ...) with the
#     variable names replaced by their current values, and how a check or loop turned out.
import sys, json, io, math, contextlib, ast, copy, re, types

SOLUTION = '<solution>'
DRIVER = '<driver>'
_id_map = {}
TOP_CALLS = []
CALL_MAP = {}
NEXT_CALL_ID = 0
CURRENT_TOP = None
LAST_TOP = None
STRUCTURE = {}
STRUCTURE_CHECKED = False
MAX_EVENTS = 2000
MAX_ITEMS = 24
MAX_SETUP_ITERS = 2     # iterations of a setup loop that stay visible
MAX_SETUP_STEPS = 8     # setup steps that stay visible per call before the rest is skipped

# ----- per-run bookkeeping -------------------------------------------------------------------
FRAME_STATE = {}        # call id -> {'shown': int, 'counts': {line: n}}
PEND = {}               # call id -> (step, info) of a check/loop header waiting for its outcome
EXC_PENDING = set()     # frames an exception is currently travelling through
REPORTED = []           # exception objects already recorded (kept alive so ids stay unique)
PENDING_SKIP = {'n': 0, 'lo': None, 'hi': None}

# ----- static analysis results (filled by _analyze) ------------------------------------------
LINE_INFO = {}
SETUP_LINES = set()
SILENT_LINES = set()
COND_KINDS = ('if', 'elif', 'while', 'for')
CODE = ''

_REPEAT_QUIET = ('assign', 'aug', 'expr', 'return', 'stmt')
_NOISE_EXC = (GeneratorExit, StopIteration, StopAsyncIteration, KeyboardInterrupt)
_TRANSPARENT_NAMES = ('<genexpr>', '<listcomp>', '<dictcomp>', '<setcomp>', '<lambda>')
_CO_GENERATOR = 0x20


class _StopTrace(BaseException):
    pass


# ================================================================================================
# Small helpers
# ================================================================================================
_ADDR = re.compile(r' at 0x[0-9a-fA-F]+')


def _short(v):
    try:
        s = repr(v)
    except Exception:
        s = '<unreadable>'
    s = _ADDR.sub('', s)
    return s[:40]


def _stable_id(v):
    k = id(v)
    if k not in _id_map:
        _id_map[k] = len(_id_map)
    return _id_map[k]


def _is_int(v):
    return isinstance(v, int) and not isinstance(v, bool)


def _err_text(e):
    if isinstance(e, BaseException):
        msg = str(e)
        s = type(e).__name__ + (': ' + msg if msg else '')
    else:
        s = str(e)
    return s[:200]


def _clip(s, n):
    return s if len(s) <= n else s[:n - 1] + '…'


_PRIM = (int, float, str, bool, type(None))


def _prim_ok(v):
    if not isinstance(v, _PRIM):
        return False
    if isinstance(v, float) and (math.isnan(v) or math.isinf(v)):
        return False
    if isinstance(v, str) and len(v) > 16:
        return False
    return True


def snap(value, depth=0, seen=None):
    if seen is None:
        seen = set()
    try:
        if value is None:
            return None
        if isinstance(value, bool):
            return value
        if isinstance(value, int):
            return value
        if isinstance(value, float):
            if math.isnan(value):
                return 'nan'
            if math.isinf(value):
                return 'inf' if value > 0 else '-inf'
            return value
        if isinstance(value, str):
            return value
        oid = id(value)
        if oid in seen:
            return {'t': 'str', 'v': '<cycle>'}
        if depth > 3:
            return {'t': 'str', 'v': _short(value)}
        if hasattr(value, 'left') and hasattr(value, 'right'):
            return {'t': 'node', 'id': _stable_id(value), 'val': snap(getattr(value, 'val', None), depth + 1, seen | {oid})}
        if isinstance(value, (list, tuple)) or type(value).__name__ == 'deque':
            seen2 = seen | {oid}
            items = list(value)
            out = [snap(x, depth + 1, seen2) for x in items[:MAX_ITEMS]]
            r = {'t': 'list', 'v': out}
            if len(items) > MAX_ITEMS:
                r['more'] = len(items) - MAX_ITEMS
            return r
        if isinstance(value, (set, frozenset)):
            seen2 = seen | {oid}
            items = list(value)
            out = [snap(x, depth + 1, seen2) for x in items[:MAX_ITEMS]]
            r = {'t': 'set', 'v': out}
            if len(items) > MAX_ITEMS:
                r['more'] = len(items) - MAX_ITEMS
            return r
        if isinstance(value, dict):
            seen2 = seen | {oid}
            items = list(value.items())
            out = [[snap(k, depth + 1, seen2), snap(x, depth + 1, seen2)] for k, x in items[:MAX_ITEMS]]
            r = {'t': 'dict', 'v': out}
            if len(items) > MAX_ITEMS:
                r['more'] = len(items) - MAX_ITEMS
            return r
        if hasattr(value, 'val') and not callable(value):
            # a generic node-like object (e.g. a linked-list node): show "ListNode(3)", never a memory address
            return {'t': 'str', 'v': type(value).__name__ + '(' + _short(getattr(value, 'val', None)) + ')'}
    except Exception:
        pass
    return {'t': 'str', 'v': _short(value)}


# ================================================================================================
# Static analysis: what kind of statement is on each line, and which lines are "setup"
# ================================================================================================
_SAFE_FUNCS = {
    'len', 'range', 'list', 'set', 'dict', 'tuple', 'frozenset', 'int', 'float', 'str', 'bool',
    'min', 'max', 'abs', 'sum', 'sorted', 'enumerate', 'zip', 'reversed', 'deque', 'defaultdict',
    'Counter', 'ord', 'chr', 'round', 'heapify', 'heappush',
}
_SAFE_METHODS = {
    'append', 'appendleft', 'add', 'extend', 'extendleft', 'update', 'setdefault', 'insert', 'get',
    'items', 'keys', 'values', 'copy', 'sort', 'reverse', 'join', 'split', 'strip', 'lower', 'upper',
    'heapify', 'heappush',
}


def _calls_safe(node):
    """True when the expression only uses harmless builtin/container calls (no user functions)."""
    for n in ast.walk(node):
        if isinstance(n, ast.Call):
            f = n.func
            if isinstance(f, ast.Name):
                if f.id not in _SAFE_FUNCS:
                    return False
            elif isinstance(f, ast.Attribute):
                if f.attr not in _SAFE_METHODS:
                    return False
            else:
                return False
        elif isinstance(n, (ast.Await, ast.Yield, ast.YieldFrom, ast.NamedExpr)):
            return False
    return True


def _pure(node):
    """No calls / lambdas / comprehensions: safe to evaluate just to show a value."""
    for n in ast.walk(node):
        if isinstance(n, (ast.Call, ast.Lambda, ast.ListComp, ast.SetComp, ast.DictComp, ast.GeneratorExp,
                          ast.Await, ast.Yield, ast.YieldFrom, ast.NamedExpr)):
            return False
    return True


def _names_read(node):
    return {n.id for n in ast.walk(node) if isinstance(n, ast.Name) and isinstance(n.ctx, ast.Load)}


def _setup_stmt(st, in_loop):
    """A statement that only prepares data: init of arrays/dicts/sets, adjacency building, counting."""
    if isinstance(st, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
        return not in_loop
    if isinstance(st, (ast.Pass, ast.Import, ast.ImportFrom, ast.Global, ast.Nonlocal)):
        return True
    if isinstance(st, ast.Assign):
        if not _calls_safe(st.value):
            return False
        if in_loop:
            reads = _names_read(st.value)
            for t in st.targets:
                for n in ast.walk(t):
                    if isinstance(n, ast.Name) and n.id in reads:
                        return False  # reads what it writes (accumulator / dp / relaxation): real algorithm, keep it
        return True
    if isinstance(st, ast.AnnAssign):
        return st.value is None or _calls_safe(st.value)
    if isinstance(st, ast.AugAssign):
        if not _calls_safe(st.value):
            return False
        return (not in_loop) if isinstance(st.target, ast.Name) else True
    if isinstance(st, ast.Expr):
        v = st.value
        if isinstance(v, ast.Constant):
            return True
        return isinstance(v, ast.Call) and _calls_safe(v)
    if isinstance(st, ast.For):
        return _calls_safe(st.iter) and not st.orelse and all(_setup_stmt(b, True) for b in st.body)
    # an `if` is decision logic, never plain setup
    return False


def _mark_setup(st):
    if isinstance(st, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
        first = st.body[0].lineno if st.body else st.lineno + 1
        start = min([st.lineno] + [d.lineno for d in st.decorator_list])
        SILENT_LINES.update(range(start, first))
        return
    if isinstance(st, ast.Expr) and isinstance(st.value, ast.Constant):
        SILENT_LINES.update(range(st.lineno, (st.end_lineno or st.lineno) + 1))  # docstring
        return
    if isinstance(st, ast.For):
        SETUP_LINES.update(range(st.lineno, (st.iter.end_lineno or st.lineno) + 1))
        for b in st.body:
            _mark_setup(b)
        return
    if isinstance(st, ast.If):
        SETUP_LINES.update(range(st.lineno, (st.test.end_lineno or st.lineno) + 1))
        for b in st.body + st.orelse:
            _mark_setup(b)
        return
    SETUP_LINES.update(range(st.lineno, (st.end_lineno or st.lineno) + 1))


_KIND = {
    ast.Assign: 'assign', ast.AnnAssign: 'assign', ast.AugAssign: 'aug', ast.Expr: 'expr',
    ast.Return: 'return', ast.While: 'while', ast.For: 'for', ast.Break: 'break',
    ast.Continue: 'continue', ast.Pass: 'pass', ast.Raise: 'raise', ast.Assert: 'assert',
    ast.Try: 'try', ast.With: 'with', ast.Delete: 'del',
    ast.FunctionDef: 'def', ast.AsyncFunctionDef: 'def', ast.ClassDef: 'def',
}


def _analyze(code):
    global CODE
    CODE = code
    try:
        tree = ast.parse(code)
    except Exception:
        return
    code_lines = code.split('\n')
    # leading setup statements of every function
    for node in ast.walk(tree):
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
            for st in node.body:
                if _setup_stmt(st, False):
                    _mark_setup(st)
                else:
                    break
    # per-line statement info
    for node in ast.walk(tree):
        if not isinstance(node, ast.stmt):
            continue
        kind = _KIND.get(type(node))
        info = {'node': node}
        if isinstance(node, ast.If):
            text = code_lines[node.lineno - 1].lstrip() if node.lineno - 1 < len(code_lines) else ''
            kind = 'elif' if text.startswith('elif') else 'if'
            header_end = node.test.end_lineno or node.lineno
        elif isinstance(node, ast.While):
            header_end = node.test.end_lineno or node.lineno
        elif isinstance(node, ast.For):
            header_end = node.iter.end_lineno or node.lineno
            info['tg'] = [n.id for n in ast.walk(node.target) if isinstance(n, ast.Name)]
        elif isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef, ast.Try, ast.With)):
            header_end = node.lineno
        else:
            header_end = node.end_lineno or node.lineno
        if kind is None:
            kind = 'stmt'
        info['k'] = kind
        if kind in COND_KINDS and getattr(node, 'body', None):
            info['body'] = set(range(node.body[0].lineno, (node.body[-1].end_lineno or node.body[-1].lineno) + 1))
        for ln in range(node.lineno, header_end + 1):
            LINE_INFO.setdefault(ln, info)
    for node in ast.walk(tree):
        if isinstance(node, ast.ExceptHandler):
            LINE_INFO.setdefault(node.lineno, {'node': node, 'k': 'except'})


class _Sub(ast.NodeTransformer):
    """Replace variable names by their current (primitive) values, like writing values on paper."""

    def __init__(self, frame):
        self.f = frame

    def visit_Name(self, node):
        if isinstance(node.ctx, ast.Load):
            f = self.f
            if node.id in f.f_locals:
                v = f.f_locals[node.id]
            elif node.id in f.f_globals:
                v = f.f_globals[node.id]
            else:
                return node
            if _prim_ok(v):
                return ast.copy_location(ast.Constant(v), node)
        return node

    def visit_Call(self, node):
        if not isinstance(node.func, ast.Name):
            node.func = self.visit(node.func)
        node.args = [self.visit(a) for a in node.args]
        for k in node.keywords:
            k.value = self.visit(k.value)
        return node

    def visit_Lambda(self, node):
        return node

    visit_ListComp = visit_SetComp = visit_DictComp = visit_GeneratorExp = visit_Lambda


class _Eval(ast.NodeTransformer):
    """Evaluate pure sub-expressions such as state[1] or node.val into plain values."""

    def __init__(self, frame):
        self.f = frame

    def _try(self, node):
        if not _pure(node):
            return node
        try:
            expr = ast.fix_missing_locations(ast.Expression(copy.deepcopy(node)))
            v = eval(compile(expr, '<viz>', 'eval'), self.f.f_globals, self.f.f_locals)
        except Exception:
            return node
        if _prim_ok(v):
            return ast.copy_location(ast.Constant(v), node)
        return node

    def visit_Subscript(self, node):
        return self._try(self.generic_visit(node))

    def visit_Attribute(self, node):
        return self._try(self.generic_visit(node))

    def visit_Lambda(self, node):
        return node

    visit_ListComp = visit_SetComp = visit_DictComp = visit_GeneratorExp = visit_Lambda


def _target_expr(node):
    k = type(node)
    if k in (ast.If, ast.While):
        return node.test
    if k is ast.For:
        return node.iter
    if k is ast.Return:
        return node.value
    if k is ast.Expr:
        return node.value
    if k in (ast.Assign, ast.AnnAssign, ast.AugAssign):
        return node
    return None


def _unparse(n):
    try:
        return ast.unparse(n)
    except Exception:
        return None


def _src(node):
    """The expression exactly as the learner wrote it (one line)."""
    try:
        seg = ast.get_source_segment(CODE, node)
    except Exception:
        seg = None
    return ' '.join(seg.split()) if seg else None


def _target_text(t):
    if isinstance(t, (ast.Tuple, ast.List)):
        return ', '.join(_unparse(e) or '?' for e in t.elts)
    return _unparse(t)


def _stmt_x(frame, info):
    """What the line is, with names replaced by values: {k, s, v?, t?}."""
    if info is None:
        return None
    x = {'k': info['k']}
    try:
        expr = _target_expr(info['node'])
        if expr is not None:
            sub = _Sub(frame).visit(copy.deepcopy(expr))
            changed = ast.dump(sub) != ast.dump(expr)
            s = _unparse(sub) if changed else (_src(expr) or _unparse(expr))
            if s is not None:
                x['s'] = _clip(s, 90)
                ev = _Eval(frame).visit(copy.deepcopy(sub))
                v = _unparse(ev)
                base = _unparse(sub)
                if v is not None and v != base and info['k'] != 'assign':
                    x['v'] = _clip(v, 90)
        if info['k'] == 'for':
            t = _target_text(info['node'].target)
            if t:
                x['t'] = _clip(t, 40)
    except Exception:
        pass
    return x


def _exc_facts(frame, exc, info):
    """Concrete reasons an exception happened, read from the live values (indexes, None, zero...)."""
    facts = []
    if info is None:
        return facts
    node = info['node']
    if isinstance(node, (ast.If, ast.While)):
        roots = [node.test]
    elif isinstance(node, ast.For):
        roots = [node.iter]
    else:
        roots = [node]

    def ev(n):
        expr = ast.fix_missing_locations(ast.Expression(copy.deepcopy(n)))
        return eval(compile(expr, '<viz>', 'eval'), frame.f_globals, frame.f_locals)

    try:
        for root in roots:
            for n in ast.walk(root):
                if len(facts) >= 3:
                    break
                if isinstance(n, ast.Subscript) and _pure(n) and not isinstance(n.slice, ast.Slice):
                    try:
                        c, i = ev(n.value), ev(n.slice)
                    except Exception:
                        continue
                    csrc, isrc = _unparse(n.value), _unparse(n.slice)
                    if isinstance(c, (list, tuple, str)) and _is_int(i) and not (-len(c) <= i < len(c)):
                        hi = len(c) - 1
                        valid = '0..' + str(hi) if hi >= 0 else 'none, it is empty'
                        facts.append('index ' + str(i) + ' in `' + str(csrc) + '[' + str(isrc) + ']` is out of range: `' + str(csrc) + '` has ' + str(len(c)) + ' item(s), valid indexes: ' + valid)
                    elif isinstance(c, dict):
                        try:
                            missing = i not in c
                        except Exception:
                            missing = False
                        if missing:
                            facts.append('key ' + _short(i) + ' is not in `' + str(csrc) + '`')
                elif isinstance(n, ast.Attribute) and _pure(n):
                    try:
                        b = ev(n.value)
                    except Exception:
                        continue
                    if b is None:
                        facts.append('`' + str(_unparse(n.value)) + '` is None here, so `.' + n.attr + '` cannot be read')
                elif isinstance(n, ast.BinOp) and isinstance(n.op, (ast.Div, ast.FloorDiv, ast.Mod)) and _pure(n.right):
                    try:
                        d = ev(n.right)
                    except Exception:
                        continue
                    if d == 0:
                        facts.append('the divisor `' + str(_unparse(n.right)) + '` is 0')
    except Exception:
        pass
    seen = set()
    out = []
    for f in facts:
        if f not in seen:
            seen.add(f)
            out.append(_clip(f, 160))
    return out[:3]


# ================================================================================================
# Frame helpers
# ================================================================================================
def _arg_names(frame):
    c = frame.f_code
    n = c.co_argcount + c.co_kwonlyargcount
    return c.co_varnames[:n]


def _arg_dict(frame):
    out = {}
    for name in _arg_names(frame):
        if name in ('self', 'cls'):
            continue
        if name in frame.f_locals:
            out[name] = frame.f_locals[name]
    return out


_HIDDEN_TYPES = (types.FunctionType, types.BuiltinFunctionType, types.MethodType, types.ModuleType, type, types.GeneratorType)


def _hidden(name, v):
    """Names the learner should never see: interpreter internals, functions, iterators."""
    if name in ('self', 'cls', '_') or name.startswith('.') or name.startswith('__'):
        return True
    if isinstance(v, _HIDDEN_TYPES):
        return True
    if hasattr(v, '__next__') and hasattr(v, '__iter__'):
        return True
    return False


def _snapshot_locals(frame):
    c = frame.f_code
    names = []
    n = c.co_argcount + c.co_kwonlyargcount
    loc = frame.f_locals
    for name in c.co_varnames[:n]:
        if name in loc:
            names.append(name)
    for name in loc:
        if name not in names:
            names.append(name)
    out = {}
    for name in names:
        try:
            v = loc[name]
            if _hidden(name, v):
                continue
            out[name] = snap(v)
        except Exception:
            out[name] = {'t': 'str', 'v': '<unreadable>'}
        if len(out) >= 8:
            break
    return out


def _fn_name(frame):
    name = frame.f_code.co_name
    owner = None
    self_obj = frame.f_locals.get('self')
    cls_obj = frame.f_locals.get('cls')
    if self_obj is not None:
        owner = type(self_obj).__name__
    elif isinstance(cls_obj, type):
        owner = cls_obj.__name__
    return (owner + '.' + name) if owner else name


def _is_transparent(code):
    """Generator expressions, comprehensions, lambdas and generators are plumbing, not steps."""
    if code.co_filename not in (SOLUTION, DRIVER):
        return False
    return code.co_name in _TRANSPARENT_NAMES or bool(code.co_flags & _CO_GENERATOR)


def _owner(frame):
    """The nearest real (non-plumbing) caller of this frame."""
    f = frame.f_back
    while f is not None and _is_transparent(f.f_code):
        f = f.f_back
    return f


# ================================================================================================
# Recording
# ================================================================================================
def _note_skip(line):
    PENDING_SKIP['n'] += 1
    PENDING_SKIP['lo'] = line if PENDING_SKIP['lo'] is None else min(PENDING_SKIP['lo'], line)
    PENDING_SKIP['hi'] = line if PENDING_SKIP['hi'] is None else max(PENDING_SKIP['hi'], line)


def _gate(cid, line):
    """Decide whether a line event is shown. Setup work is shown only a few times."""
    if line in SILENT_LINES:
        return 'silent'
    if line not in SETUP_LINES:
        return 'show'
    fs = FRAME_STATE.setdefault(cid, {'shown': 0, 'counts': {}})
    c = fs['counts'].get(line, 0) + 1
    fs['counts'][line] = c
    if c > MAX_SETUP_ITERS or fs['shown'] >= MAX_SETUP_STEPS:
        return 'skip'
    fs['shown'] += 1
    return 'show'


def _record(top, frame, event, ret=None, err=None, x=None, extra=None):
    if len(top['steps']) >= MAX_EVENTS:
        top['outcome'] = 'limit'
        sys.settrace(None)
        raise _StopTrace()
    info = CALL_MAP.get(id(frame))
    if info is None:
        return None
    step = {
        'ev': event, 'call': info['id'], 'parent': info['parent'], 'depth': info['depth'],
        'fn': info['fn'], 'line': frame.f_lineno, 'locals': _snapshot_locals(frame),
    }
    if event == 'call' or event == 'return':
        step['ar'] = [n for n in _arg_names(frame) if n not in ('self', 'cls')]
    if event == 'return':
        step['ret'] = snap(ret)
    if event == 'exception':
        step['err'] = _err_text(err)
        step['et'] = type(err).__name__
        step['em'] = str(err)[:160]
    if x:
        step['x'] = x
    if extra:
        step.update(extra)
    if PENDING_SKIP['n'] > 0:
        step['sk'] = {'n': PENDING_SKIP['n'], 'a': PENDING_SKIP['lo'], 'b': PENDING_SKIP['hi']}
        PENDING_SKIP['n'] = 0
        PENDING_SKIP['lo'] = None
        PENDING_SKIP['hi'] = None
    top['steps'].append(step)
    return step


def _resolve_pending(cid, event, frame):
    """A check/loop header learns its outcome from where execution goes next."""
    pend = PEND.pop(cid, None)
    if pend is None or event == 'exception':
        return
    step, info = pend
    x = step.get('x')
    if x is None:
        return
    inside = frame.f_lineno in info.get('body', ())
    k = info['k']
    if k in ('if', 'elif', 'while'):
        x['o'] = 'T' if inside else 'F'
    elif k == 'for':
        x['o'] = 'N' if inside else 'D'
        if inside:
            loc = frame.f_locals
            iv = {}
            for name in info.get('tg', []):
                if name in loc and not _hidden(name, loc[name]):
                    iv[name] = snap(loc[name])
            if iv:
                x['iv'] = iv


def _trace(frame, event, arg):
    global CURRENT_TOP, LAST_TOP, NEXT_CALL_ID, STRUCTURE, STRUCTURE_CHECKED
    code = frame.f_code
    if code.co_filename != SOLUTION:
        return None
    if event == 'call':
        if _is_transparent(code):
            return None
        caller = _owner(frame)
        short = code.co_name
        is_dunder = short.startswith('__') and short.endswith('__')
        if caller is not None and caller.f_code.co_filename == DRIVER:
            if is_dunder:
                return None
            if not STRUCTURE_CHECKED:
                STRUCTURE = _detect_structure(_arg_dict(frame))
                STRUCTURE_CHECKED = True
            cid = NEXT_CALL_ID
            NEXT_CALL_ID += 1
            info = {'id': cid, 'parent': None, 'depth': 0, 'fn': _fn_name(frame)}
            CALL_MAP[id(frame)] = info
            top = {'fn': info['fn'], 'args': _snapshot_locals(frame), 'outcome': 'ok', 'result': None, 'steps': []}
            TOP_CALLS.append(top)
            CURRENT_TOP = top
            LAST_TOP = top
            _record(top, frame, 'call')
            return _trace
        parent = CALL_MAP.get(id(caller)) if caller is not None else None
        if parent is None or CURRENT_TOP is None:
            return None
        cid = NEXT_CALL_ID
        NEXT_CALL_ID += 1
        CALL_MAP[id(frame)] = {'id': cid, 'parent': parent['id'], 'depth': parent['depth'] + 1, 'fn': _fn_name(frame)}
        _record(CURRENT_TOP, frame, 'call', extra={'cl': caller.f_lineno})
        return _trace
    info = CALL_MAP.get(id(frame))
    if info is None or CURRENT_TOP is None:
        return None
    cid = info['id']

    if event == 'line':
        _resolve_pending(cid, event, frame)
        EXC_PENDING.discard(id(frame))
        line = frame.f_lineno
        li = LINE_INFO.get(line)
        fs = FRAME_STATE.setdefault(cid, {'shown': 0, 'counts': {}})
        repeat = fs.get('prev_line') == line
        fs['prev_line'] = line
        if repeat and (li is None or li['k'] in _REPEAT_QUIET):
            return _trace  # a comprehension re-firing the same line: not a new step
        if li is not None and li['k'] == 'try':
            return _trace  # 'try:' does nothing by itself
        gate = _gate(cid, line)
        if gate == 'silent':
            return _trace
        if gate == 'skip':
            _note_skip(line)
            return _trace
        if li is not None and line != li['node'].lineno and fs.get('last') is li['node']:
            return _trace  # continuation line of a statement that is already shown
        fs['last'] = li['node'] if li is not None else None
        step = _record(CURRENT_TOP, frame, 'line', x=_stmt_x(frame, li))
        if step is not None and li is not None and li['k'] in COND_KINDS:
            PEND[cid] = (step, li)
    elif event == 'return':
        _resolve_pending(cid, event, frame)
        unwinding = id(frame) in EXC_PENDING
        EXC_PENDING.discard(id(frame))
        if not unwinding:
            line = frame.f_lineno
            li = LINE_INFO.get(line)
            if li is not None and li['k'] == 'return':
                x = _stmt_x(frame, li)
            else:
                x = {'k': 'end'}
            steps = CURRENT_TOP['steps']
            carry = None
            if steps and x.get('k') == 'return':
                last = steps[-1]
                if last['ev'] == 'line' and last['call'] == cid and last['line'] == line and (last.get('x') or {}).get('k') == 'return':
                    carry = steps.pop().get('sk')
            step = _record(CURRENT_TOP, frame, 'return', ret=arg, x=x)
            if carry and step is not None and 'sk' not in step:
                step['sk'] = carry
        CALL_MAP.pop(id(frame), None)
        FRAME_STATE.pop(cid, None)
        if info['parent'] is None:
            CURRENT_TOP['result'] = snap(arg) if not unwinding else None
            CURRENT_TOP = None
    elif event == 'exception':
        _resolve_pending(cid, event, frame)
        exc = arg[1] if isinstance(arg, tuple) and len(arg) > 1 else arg
        if isinstance(exc, _NOISE_EXC):
            return _trace
        EXC_PENDING.add(id(frame))
        if any(e is exc for e in REPORTED):
            return _trace  # same error travelling up through callers: report it once
        REPORTED.append(exc)
        li = LINE_INFO.get(frame.f_lineno)
        x = _stmt_x(frame, li) or {'k': 'stmt'}
        facts = _exc_facts(frame, exc, li)
        _record(CURRENT_TOP, frame, 'exception', err=exc, x=x, extra={'facts': facts} if facts else None)
    return _trace


def _is_tree_like(v):
    return v is not None and hasattr(v, 'left') and hasattr(v, 'right')

def _build_tree(root):
    nodes = []
    stack = [root]
    seen = set()
    while stack:
        node = stack.pop()
        if node is None:
            continue
        oid = id(node)
        if oid in seen:
            continue
        seen.add(oid)
        left = getattr(node, 'left', None)
        right = getattr(node, 'right', None)
        nodes.append({
            'id': _stable_id(node),
            'val': snap(getattr(node, 'val', None), 1),
            'left': _stable_id(left) if _is_tree_like(left) else None,
            'right': _stable_id(right) if _is_tree_like(right) else None,
        })
        if _is_tree_like(right):
            stack.append(right)
        if _is_tree_like(left):
            stack.append(left)
    nodes.sort(key=lambda n: n['id'])
    return {'root': _stable_id(root), 'nodes': nodes}

def _detect_tree(args):
    for v in args.values():
        root = v
        if isinstance(v, (list, tuple)) and v and _is_tree_like(v[0]):
            root = v[0]
        if _is_tree_like(root):
            return _build_tree(root)
    return None

def _int_arg(args):
    for name, v in args.items():
        if _is_int(v) and name.lower() in ('n', 'v', 'num_vertices', 'vertices', 'num_nodes'):
            return v
    return None

def _directed_hint(args):
    return any('dir' in name.lower() for name in args.keys())

def _looks_edge_list(v):
    if not isinstance(v, (list, tuple)) or not v:
        return False
    for row in v:
        if not isinstance(row, (list, tuple)) or len(row) not in (2, 3):
            return False
        for x in row:
            if not _is_int(x):
                return False
    return True

def _adj_graph(v, n):
    if n is None or n <= 0 or not isinstance(v, (list, tuple)) or len(v) != n:
        return None
    adj = []
    for row in v:
        if not isinstance(row, (list, tuple)):
            return None
        inner = []
        for x in row:
            if not _is_int(x) or x < 0 or x >= n:
                return None
            inner.append(x)
        adj.append(inner)
    sym = all(u in adj[w] for u in range(n) for w in adj[u])
    directed = not sym
    edges = []
    seen = set()
    for u in range(n):
        for w in adj[u]:
            if directed:
                edges.append([u, w])
            else:
                key = (u, w) if u <= w else (w, u)
                if key not in seen:
                    seen.add(key)
                    edges.append([key[0], key[1]])
    return {'directed': directed, 'n': n, 'edges': edges}

def _edge_list_graph(v, n, directed):
    if n is None or n <= 0:
        return None
    edges = []
    for row in v:
        u, w = row[0], row[1]
        if u < 0 or u >= n or w < 0 or w >= n:
            return None
        edges.append([u, w, row[2]] if len(row) == 3 else [u, w])
    return {'directed': directed, 'n': n, 'edges': edges}

def _dict_graph(v, n_arg):
    if not isinstance(v, dict) or not v:
        return None
    keys = list(v.keys())
    if not all(_is_int(k) and k >= 0 for k in keys):
        return None
    n = n_arg if n_arg is not None else (max(keys) + 1)
    if n <= 0 or max(keys) >= n:
        return None
    return _adj_graph([v.get(i, []) for i in range(n)], n)

def _matrix_graph(v, n_arg):
    if not isinstance(v, (list, tuple)) or not v:
        return None
    n = len(v)
    if n_arg is not None and n_arg != n:
        return None
    for row in v:
        if not isinstance(row, (list, tuple)) or len(row) != n:
            return None
        for x in row:
            if x not in (0, 1):
                return None
    sym = all(v[i][j] == v[j][i] for i in range(n) for j in range(n))
    directed = not sym
    edges = []
    for i in range(n):
        for j in range(n):
            if v[i][j] and (directed or i < j):
                edges.append([i, j])
    return {'directed': directed, 'n': n, 'edges': edges}

def _detect_graph(args):
    n_arg = _int_arg(args)
    for name, v in args.items():
        if 'edge' in name.lower() and _looks_edge_list(v):
            n = n_arg if n_arg is not None else (max(max(r[0], r[1]) for r in v) + 1)
            g = _edge_list_graph(v, n, _directed_hint(args))
            if g:
                return g
    for name, v in args.items():
        if not isinstance(v, (list, tuple)) or not v:
            continue
        if not all(isinstance(row, (list, tuple)) for row in v):
            continue
        lower = name.lower()
        n = n_arg if n_arg is not None else len(v)
        if n_arg is not None and len(v) != n_arg:
            continue
        if n_arg is not None and all(len(row) in (2, 3) for row in v) and 'adj' not in lower and 'graph' not in lower:
            continue
        g = _adj_graph(v, n)
        if g:
            return g
    for v in args.values():
        g = _dict_graph(v, n_arg)
        if g:
            return g
    for v in args.values():
        g = _matrix_graph(v, n_arg)
        if g:
            return g
    return None

def _detect_structure(args):
    s = {}
    t = _detect_tree(args)
    if t:
        s['tree'] = t
    g = _detect_graph(args)
    if g:
        s['graph'] = g
    return s



def main():
    global MAX_EVENTS, MAX_ITEMS, MAX_SETUP_ITERS, MAX_SETUP_STEPS, STRUCTURE, STRUCTURE_CHECKED
    empty = json.dumps({'printed': '', 'structure': {}, 'topCalls': []}, separators=(',', ':'))
    try:
        cfg = json.loads(sys.stdin.read())
        code = cfg.get('code', '')
        driver = cfg.get('driver', '')
        MAX_EVENTS = int(cfg.get('maxEvents', 2000))
        MAX_ITEMS = int(cfg.get('maxItems', 24))
        MAX_SETUP_ITERS = int(cfg.get('setupIters', MAX_SETUP_ITERS))
        MAX_SETUP_STEPS = int(cfg.get('setupSteps', MAX_SETUP_STEPS))
    except Exception:
        sys.stdout.write(empty)
        return
    try:
        code_obj = compile(code, SOLUTION, 'exec')
        driver_obj = compile(driver, DRIVER, 'exec')
    except Exception:
        sys.stdout.write(empty)
        return
    _analyze(code)
    g = {'__name__': '__main__'}
    try:
        exec(code_obj, g)
    except Exception:
        sys.stdout.write(empty)
        return
    buf = io.StringIO()
    try:
        with contextlib.redirect_stdout(buf):
            sys.setrecursionlimit(1500)
            sys.settrace(_trace)
            exec(driver_obj, g)
    except _StopTrace:
        pass
    except BaseException as e:
        if LAST_TOP is not None:
            LAST_TOP['outcome'] = 'crash'
            LAST_TOP['result'] = None
            LAST_TOP['error'] = _err_text(e)
    finally:
        sys.settrace(None)
    top_calls = []
    for t in TOP_CALLS:
        steps = t['steps']
        for idx, s in enumerate(steps):
            # an error that the program survives (try/except) is not the end of the run
            if s['ev'] == 'exception' and idx < len(steps) - 1:
                s['h'] = True
        item = {'fn': t['fn'], 'args': t['args'], 'outcome': t['outcome'], 'result': t['result'], 'steps': steps}
        if 'error' in t:
            item['error'] = t['error']
        top_calls.append(item)
    out = {'printed': buf.getvalue(), 'structure': STRUCTURE, 'topCalls': top_calls}
    sys.stdout.write(json.dumps(out, ensure_ascii=False, separators=(',', ':')))


if __name__ == '__main__':
    main()
