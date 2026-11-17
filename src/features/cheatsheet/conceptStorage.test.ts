/** @vitest-environment jsdom */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  loadConceptsState,
  saveConceptsState,
  setConceptStatus,
  setLastOpened,
  cycleStatus,
  validate,
} from './conceptStorage';

describe('conceptStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns empty state when nothing stored', () => {
    expect(loadConceptsState().status).toEqual({});
  });

  it('round-trips through storage', () => {
    saveConceptsState({ status: { 'binary-search': 'learning' }, language: 'python' });
    const s = loadConceptsState();
    expect(s.status['binary-search']).toBe('learning');
    expect(s.language).toBe('python');
  });

  it('validate rejects non-record', () => {
    expect(validate(null)).toBeNull();
    expect(validate([])).toBeNull();
    expect(validate('str')).toBeNull();
    expect(validate(42)).toBeNull();
  });

  it('validate filters invalid statuses', () => {
    const v = validate({ status: { a: 'invalid', b: 'learning' } });
    expect(v?.status.a).toBeUndefined();
    expect(v?.status.b).toBe('learning');
  });

  it('validate filters invalid language', () => {
    expect(validate({ status: {}, language: 'rust' })?.language).toBeUndefined();
    expect(validate({ status: {}, language: 'java' })?.language).toBe('java');
  });

  it('cycles through all three states', () => {
    expect(cycleStatus('not-started')).toBe('learning');
    expect(cycleStatus('learning')).toBe('completed');
    expect(cycleStatus('completed')).toBe('not-started');
  });

  it('setConceptStatus updates one entry', () => {
    saveConceptsState({ status: { a: 'learning' } });
    const next = setConceptStatus('b', 'completed');
    expect(next.status.b).toBe('completed');
    expect(next.status.a).toBe('learning');
    expect(loadConceptsState().status.b).toBe('completed');
  });

  it('setLastOpened records the id', () => {
    setLastOpened('two-pointers');
    expect(loadConceptsState().lastOpened).toBe('two-pointers');
  });
});
