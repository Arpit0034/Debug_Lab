import type { VizDefinition } from './types';

const REGISTRY = new Map<string, VizDefinition<unknown>>();

export function registerViz<I>(def: VizDefinition<I>): void {
  REGISTRY.set(def.id, def as unknown as VizDefinition<unknown>);
}

export function getViz(id: string): VizDefinition<unknown> | undefined {
  return REGISTRY.get(id);
}

export function listViz(): VizDefinition<unknown>[] {
  return [...REGISTRY.values()];
}
