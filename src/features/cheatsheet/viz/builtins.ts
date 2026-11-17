import { registerViz } from './vizRegistry';
import { binarySearchViz } from './generators/binary-search';
import { twoPointersViz } from './generators/two-pointers';
import { slidingWindowViz } from './generators/sliding-window';
import { monotonicStackViz } from './generators/monotonic-stack';
import { mergeSortViz } from './generators/merge-sort';
import { climbingStairsViz } from './generators/dp-climbing-stairs';
import { graphBfsViz } from './generators/graph-bfs';
import { graphDfsViz } from './generators/graph-dfs';
import { graphDijkstraViz } from './generators/graph-dijkstra';
import { unionFindViz } from './generators/union-find';
import {
  preorderViz,
  inorderViz,
  postorderViz,
  levelorderViz,
} from './generators/tree-traversal';

let registered = false;

export function registerBuiltinViz(): void {
  if (registered) return;
  registered = true;
  registerViz(binarySearchViz);
  registerViz(twoPointersViz);
  registerViz(slidingWindowViz);
  registerViz(monotonicStackViz);
  registerViz(mergeSortViz);
  registerViz(climbingStairsViz);
  registerViz(graphBfsViz);
  registerViz(graphDfsViz);
  registerViz(graphDijkstraViz);
  registerViz(unionFindViz);
  registerViz(preorderViz);
  registerViz(inorderViz);
  registerViz(postorderViz);
  registerViz(levelorderViz);
}
