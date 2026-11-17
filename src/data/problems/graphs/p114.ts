import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p114',
  title: 'The reliable route gains impossible certainty',
  difficulty: 'Medium',
  topic: 'Graphs',
  subtopic: 'Maximum Probability Path',
  tags: ['Weighted Graphs', 'Path Probability', 'Graph Traversal'],
  bugCategory: 'Incorrect Algorithm Selection',
  sourceInspiredBy: 'Maximum probability route pattern',
  description:
    'Given a directed network where each edge has a success probability, return the greatest probability of successfully travelling from the first vertex to the last vertex. A probability of zero represents a missing edge.',
  constraints: [
    '1 <= n <= 300',
    '0 <= probability[i][j] <= 1',
    'The graph may be disconnected.',
  ],
  examples: [
    {
      input: 'probability = [[0,0.5,0.8,0],[0,0,0,0.5],[0,0,0,0.1],[0,0,0,0]]',
      output: '0.25',
      note: 'The route through vertex 1 has the greatest combined success probability.',
    },
    {
      input: 'probability = [[0,0.5],[0,0]]',
      output: '0.50',
    },
  ],
  hints: [
    'Consider how the probabilities of consecutive independent edges combine.',
    'Compare the operation used to extend a route with the operation used for ordinary distance totals.',
  ],
  complexity: { time: 'O(V^2)', space: 'O(V)' },
  explanation: {
    overview: 'Find the route with the greatest probability of successfully reaching the destination.',
    algorithm: 'Start with probability one at the source and zero at all other vertices. Repeatedly select the unprocessed vertex with the greatest current probability. Extend its route probability by multiplying it with the probability of each outgoing edge. Retain an improvement whenever the resulting probability is greater.',
    bug: 'The route extension adds the edge probability to the current probability instead of multiplying them.',
    whyItFails: 'The probability of successfully completing independent consecutive steps is the product of their probabilities. Adding probabilities can produce values greater than one and does not represent the chance of completing the entire route.',
    failingTestCase: 'For the first graph, the best route has probability 0.5 * 0.5 = 0.25. The buggy addition operation produces an incorrect value of 2.00.',
    fix: 'Calculate candidate = best[u] * probability[u][v].',
    whyFixWorks: 'Multiplication correctly represents the probability that every edge in the selected route succeeds. Comparing these products identifies the most reliable route.',
    dryRun: 'Start with best[0] = 1. From vertex 0, vertex 1 receives 0.5 and vertex 2 receives 0.8. Process vertex 2 first and calculate 0.8 * 0.1 = 0.08 for vertex 3. Then process vertex 1 and calculate 0.5 * 0.5 = 0.25. The maximum probability is 0.25.',
    debuggingLesson: 'When combining quantities across a sequence, verify the mathematical operation that represents the real-world meaning. Probabilities, costs, and counts often require different composition rules.',
  },
  testCases: [
    {
      input: '[[0,0.5,0.8,0],[0,0,0,0.5],[0,0,0,0.1],[0,0,0,0]]',
      expected: '0.25',
      buggyOutput: '2.00',
    },
    {
      input: '[[0,0.5],[0,0]]',
      expected: '0.50',
    },
  ],
  harness: {
    expected: '0.25 0.50',
    driver: {
      java: `double[][] a = {{0,0.5,0.8,0},{0,0,0,0.5},{0,0,0,0.1},{0,0,0,0}};
double[][] b = {{0,0.5},{0,0}};
System.out.printf(java.util.Locale.US, "%.2f %.2f", Solution.maxProbability(a), Solution.maxProbability(b));`,
      python: `a = [[0,0.5,0.8,0],[0,0,0,0.5],[0,0,0,0.1],[0,0,0,0]]
b = [[0,0.5],[0,0]]
print(f"{max_probability(a):.2f} {max_probability(b):.2f}")`,
      c: `double a[16] = {0,0.5,0.8,0,0,0,0,0.5,0,0,0,0.1,0,0,0,0};
double b[4] = {0,0.5,0,0};
printf("%.2f %.2f",max_probability(a,4),max_probability(b,2));`,
    },
  },
  code: {
    java: {
      correct: `
class Solution {
    static double maxProbability(double[][] graph) {
        int n = graph.length;
        double[] best = new double[n];
        boolean[] used = new boolean[n];
        best[0] = 1.0;
        for (int count = 0; count < n; count++) {
            int u = -1;
            for (int v = 0; v < n; v++) {
                if (!used[v] && (u == -1 || best[v] > best[u])) u = v;
            }
            if (u == -1 || best[u] == 0) break;
            used[u] = true;
            for (int v = 0; v < n; v++) {
                if (!used[v] && graph[u][v] > 0) {
                    double candidate = best[u] * graph[u][v];
                    if (candidate > best[v]) best[v] = candidate;
                }
            }
        }
        return best[n - 1];
    }
}
`,
      bugs: {
        16: {
          was: 'best[u] * graph[u][v]',
          buggy: '                    double candidate = best[u] + graph[u][v];',
        },
      },
    },
    python: {
      correct: `
def max_probability(graph):
    n = len(graph)
    best = [0.0] * n
    used = [False] * n
    best[0] = 1.0
    for _ in range(n):
        u = -1
        for v in range(n):
            if not used[v] and (u == -1 or best[v] > best[u]):
                u = v
        if u == -1 or best[u] == 0:
            break
        used[u] = True
        for v in range(n):
            if not used[v] and graph[u][v] > 0:
                candidate = best[u] * graph[u][v]
                if candidate > best[v]:
                    best[v] = candidate
    return best[-1]
`,
      bugs: {
        16: {
          was: 'best[u] * graph[u][v]',
          buggy: '                candidate = best[u] + graph[u][v]',
        },
      },
    },
    c: {
      correct: `
double max_probability(double* graph, int n) {
    double* best = calloc(n, sizeof(double));
    int* used = calloc(n, sizeof(int));
    best[0] = 1.0;
    for (int count = 0; count < n; count++) {
        int u = -1;
        for (int v = 0; v < n; v++) {
            if (!used[v] && (u == -1 || best[v] > best[u])) u = v;
        }
        if (u == -1 || best[u] == 0) break;
        used[u] = 1;
        for (int v = 0; v < n; v++) {
            double p = graph[u*n+v];
            if (!used[v] && p > 0) {
                double candidate = best[u] * p;
                if (candidate > best[v]) best[v] = candidate;
            }
        }
    }
    double answer = best[n-1];
    free(best); free(used);
    return answer;
}
`,
      bugs: {
        15: {
          was: 'best[u] * p',
          buggy: '                double candidate = best[u] + p;',
        },
      },
    },
  },
});
