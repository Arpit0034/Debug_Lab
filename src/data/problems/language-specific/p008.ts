import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p008',
  title: 'Push creates a self loop',
  difficulty: 'Medium',
  topic: 'C Concepts',
  subtopic: 'Double Pointers',
  tags: ['Linked List', 'Pointers'],
  bugCategory: 'Incorrect Linked-List Update',
  sourceInspiredBy: 'Insert at head of a linked list',
  description:
    'push_front inserts a value at the head of a singly linked list. After pushing 1 and then 2, the list should be 2 -> 1, but traversing it never ends.',
  constraints: ['malloc always succeeds in this exercise'],
  examples: [{ input: 'push 1, push 2', output: '2 -> 1', note: 'The buggy code produces 2 -> 2 -> 2 ...' }],
  hints: ['Which line must run first: updating *head or reading *head?'],
  complexity: { time: 'O(1)', space: 'O(1)' },
  explanation: {
    overview: 'Insert a new node at the front of a list.',
    algorithm: 'Create the node, point its next at the current head, then make the new node the head. The order matters.',
    bug: 'The two pointer assignments are in the wrong order: *head is overwritten before it is read.',
    whyItFails:
      'After *head = n, reading *head gives n itself. Then n->next = *head makes the node point to itself, creating a cycle, and the old list is lost.',
    failingTestCase: 'push 1, then push 2: node 2 points to itself and node 1 is unreachable (leaked).',
    fix: 'Set n->next = *head first, then *head = n.',
    whyFixWorks: 'The old head is saved inside the new node before the head pointer is replaced.',
    dryRun: 'Head is node 1. n = node 2. n->next = *head (node 1). *head = n. Result: 2 -> 1.',
    debuggingLesson: 'Order of pointer updates matters. Always save what you still need before you overwrite it.',
  },
  testCases: [{ input: 'push 1, push 2', expected: '2 -> 1', buggyOutput: '2 -> 2 -> 2 ...' }],
  harness: {
    expected: '2 1',
    driver: {
      c: `Node *h = NULL;
push_front(&h, 1);
push_front(&h, 2);
int k = 0;
while (h && k < 5) { printf("%d ", h->val); h = h->next; k++; }`,
    },
  },
  code: {
    c: {
      correct: `
#include <stdlib.h>

typedef struct Node {
    int val;
    struct Node *next;
} Node;

void push_front(Node **head, int val) {
    Node *n = malloc(sizeof(Node));
    n->val = val;
    n->next = *head;
    *head = n;
}
`,
      bugs: { 11: { was: 'n->next = *head', buggy: '*head = n;' }, 12: { was: '*head = n', buggy: 'n->next = *head;' } },
    },
  },
});
