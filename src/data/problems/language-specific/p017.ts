import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p017',
  title: 'Every graph remembers the last one',
  difficulty: 'Medium',
  topic: 'Python Concepts',
  subtopic: 'Mutable Default Arguments',
  tags: ['Default Arguments', 'Aliasing'],
  bugCategory: 'Reference and Mutation Error',
  sourceInspiredBy: 'Mutable default argument pitfall',
  description: 'add_edge builds an undirected graph as a dictionary. When no graph is passed it should start a fresh one. Calling it twice should give two separate graphs, but the second call returns edges from the first.',
  constraints: [],
  examples: [{ input: 'add_edge(1, 2) then add_edge(3, 4)', output: 'second graph has 2 nodes', note: 'The buggy code returns a graph with 4 nodes.' }],
  hints: ['When is a default argument value created?'],
  complexity: { time: 'O(1)', space: 'O(1)' },
  explanation: {
    overview: 'Add an undirected edge to a graph, creating a new graph when none is given.',
    algorithm: 'Use an adjacency dictionary. Add each endpoint to the other endpoint list. If the caller gave no graph, make a fresh dictionary inside the function.',
    bug: 'The default value of graph is a dictionary written in the function signature.',
    whyItFails: 'Python creates a default value once, when the function is defined. Every call without a graph shares and mutates that same dictionary, so the "is None" branch can never run.',
    failingTestCase: 'add_edge(1, 2) then add_edge(3, 4): the second result contains keys 1, 2, 3 and 4.',
    fix: 'Default to None and create the dictionary inside the function.',
    whyFixWorks: 'A new dictionary is built on every call that needs one, so calls do not share state.',
    dryRun: 'First call: graph is None, a new dict is created: {1:[2], 2:[1]}. Second call: graph is None again, a different new dict: {3:[4], 4:[3]}.',
    debuggingLesson: 'Never use a list, dict or set as a default argument. Use None and build the value inside the function.',
  },
  testCases: [{ input: 'add_edge(1, 2); add_edge(3, 4)', expected: '2 nodes in the second graph', buggyOutput: '4 nodes' }],
  harness: {
    expected: '2',
    driver: {
      python: `add_edge(1, 2)\ng2 = add_edge(3, 4)\nprint(len(g2))`,
    },
  },
  code: {
    python: {
      correct: `
def add_edge(u, v, graph=None):
    if graph is None:
        graph = {}
    graph.setdefault(u, []).append(v)
    graph.setdefault(v, []).append(u)
    return graph
`,
      bugs: { 1: { was: 'graph=None', buggy: 'def add_edge(u, v, graph={}):' } },
    },
  },
});
