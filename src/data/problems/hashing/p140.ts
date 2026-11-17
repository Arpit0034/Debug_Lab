import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p140',
  title: 'Mutated signature corrupts the group',
  difficulty: 'Medium',
  topic: 'Hashing',
  subtopic: 'Key Construction',
  tags: ['Canonical Signature', 'Frequency Accumulation'],
  bugCategory: 'Reference and Mutation Error',
  sourceInspiredBy: 'Group anagrams frequency signature pattern',
  description:
    'Given a collection of lowercase words, cluster them so that words containing identical character frequencies belong to the same group. Return the size of the largest group. The implementation mutates and fails to reset the character frequency container between successive words.',
  constraints: ['1 <= words.length <= 50', '1 <= word[i].length <= 20'],
  examples: [
    { input: 'words = ["eat", "tea", "tan", "ate", "nat", "bat"]', output: '3', note: '"eat", "tea", and "ate" form the largest group of 3.' },
    { input: 'words = ["ab", "ba"]', output: '2' },
  ],
  hints: [
    'Notice how the character frequency signature is reset prior to inspecting each word.',
    'Check whether counts from earlier words leak into the signatures of subsequent words.',
  ],
  complexity: { time: 'O(n * L)', space: 'O(n * L)' },
  explanation: {
    overview: 'Group words sharing identical character counts and find the largest cluster size.',
    algorithm:
      'For each word, tally character occurrences into a 26-element signature. Words with matching signatures are mapped to the same bucket in a frequency table.',
    bug: 'The signature buffer is not zeroed before processing each word (the reset statement is bypassed).',
    whyItFails:
      'Failing to reset the signature causes counts from earlier words to accumulate into subsequent words, producing corrupt keys that never match their true anagram peers.',
    failingTestCase: 'words = ["ab", "ba"]: returns 1 instead of 2 because "ba" accumulates on top of "ab" (counts become 2, 2 instead of 1, 1).',
    fix: 'Clear the frequency buffer before processing each word: Arrays.fill(counts, 0) / memset / reinitialization.',
    whyFixWorks: 'Zeroing the buffer ensures each word generates an independent, uncorrupted canonical key.',
    dryRun:
      'For ["ab", "ba"]: "ab" resets buffer to 0, counts [1, 1], stored in table with count 1. "ba" resets buffer to 0, counts [1, 1], matches existing key, increments count to 2.',
    debuggingLesson:
      'When reusing mutable buffers across iterations, always explicitly reset all state at the start of each iteration.',
  },
  testCases: [
    { input: '["eat", "tea", "tan", "ate", "nat", "bat"]', expected: '3', buggyOutput: '1' },
    { input: '["ab", "ba"]', expected: '2', buggyOutput: '1' },
  ],
  harness: {
    expected: '3 2',
    driver: {
      java: `System.out.println(Solution.maxAnagramGroup(new String[]{"eat", "tea", "tan", "ate", "nat", "bat"}) + " " + Solution.maxAnagramGroup(new String[]{"ab", "ba"}));`,
      python: `print(max_anagram_group(["eat", "tea", "tan", "ate", "nat", "bat"]), max_anagram_group(["ab", "ba"]))`,
      c: `printf("%d %d", max_anagram_group((char*[]){"eat", "tea", "tan", "ate", "nat", "bat"}, 6), max_anagram_group((char*[]){"ab", "ba"}, 2));`,
    },
  },
  code: {
    java: {
      correct: `import java.util.*;

class Solution {
    static int maxAnagramGroup(String[] words) {
        Map<String, Integer> map = new HashMap<>();
        int maxGroup = 0;
        int[] counts = new int[26];
        for (String w : words) {
            Arrays.fill(counts, 0);
            for (int i = 0; i < w.length(); i++) {
                counts[w.charAt(i) - 'a']++;
            }
            StringBuilder sb = new StringBuilder();
            for (int c : counts) {
                sb.append(c).append('#');
            }
            String key = sb.toString();
            int cnt = map.getOrDefault(key, 0) + 1;
            map.put(key, cnt);
            if (cnt > maxGroup) {
                maxGroup = cnt;
            }
        }
        return maxGroup;
    }
}`,
      bugs: { 9: { was: 'Arrays.fill(counts, 0);', buggy: '            int unusedZero = 0;' } },
    },
    python: {
      correct: `def max_anagram_group(words):
    counts_map = {}
    max_group = 0
    counts = [0] * 26
    for w in words:
        counts = [0] * 26
        for ch in w:
            counts[ord(ch) - ord('a')] += 1
        key = tuple(counts)
        counts_map[key] = counts_map.get(key, 0) + 1
        if counts_map[key] > max_group:
            max_group = counts_map[key]
    return max_group`,
      bugs: { 6: { was: 'counts = [0] * 26', buggy: '        unused_zero = 0' } },
    },
    c: {
      correct: `#include <string.h>

int max_anagram_group(char* words[], int n) {
    int signatures[50][26];
    int freqs[50] = {0};
    int sig_count = 0;
    int max_group = 0;
    int cur_sig[26] = {0};
    for (int i = 0; i < n; i++) {
        memset(cur_sig, 0, sizeof(cur_sig));
        int len = strlen(words[i]);
        for (int j = 0; j < len; j++) {
            cur_sig[words[i][j] - 'a']++;
        }
        int found = 0;
        for (int k = 0; k < sig_count; k++) {
            if (memcmp(signatures[k], cur_sig, sizeof(cur_sig)) == 0) {
                freqs[k]++;
                if (freqs[k] > max_group) max_group = freqs[k];
                found = 1;
                break;
            }
        }
        if (!found) {
            memcpy(signatures[sig_count], cur_sig, sizeof(cur_sig));
            freqs[sig_count] = 1;
            if (1 > max_group) max_group = 1;
            sig_count++;
        }
    }
    return max_group;
}`,
      bugs: { 10: { was: 'memset(cur_sig, 0, sizeof(cur_sig));', buggy: '        int unused_zero = 0;' } },
    },
  },
});
