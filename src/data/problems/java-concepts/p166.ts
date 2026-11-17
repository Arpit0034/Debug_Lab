import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p166',
  title: 'The immutable text is changed repeatedly',
  difficulty: 'Medium',
  topic: 'Java Concepts',
  subtopic: 'String Concatenation',
  tags: ['Java', 'Strings', 'Immutability'],
  bugCategory: 'Incorrect Algorithm Selection',
  sourceInspiredBy: 'Building a string efficiently from repeated fragments',
  description: 'Return a string formed by joining all supplied fragments in their original order.',
  constraints: ['0 <= fragments.length <= 10000'],
  examples: [{ input: '["ab","cd","e"]', output: '"abcde"' }],
  hints: ['Repeatedly creating a new immutable value has a cost.', 'A mutable builder can accumulate fragments.'],
  complexity: { time: 'O(total characters)', space: 'O(total characters)' },
  explanation: {
    overview: 'Join a sequence of string fragments.',
    algorithm: 'Append fragments to a mutable builder and convert once at the end.',
    bug: 'The accumulator is reset on every iteration.',
    whyItFails: 'Only the final fragment remains.',
    failingTestCase: '["ab","cd","e"] returns "e" under the mutation.',
    fix: 'Create the builder once before the loop.',
    whyFixWorks: 'Every append contributes to the same accumulated value.',
    dryRun: 'Append ab, then cd, then e to obtain abcde.',
    debuggingLesson: 'Object lifetime and initialization placement determine whether state accumulates.'
  },
  testCases: [{ input: '["ab","cd","e"]', expected: 'abcde' }],
  harness: { expected: 'abcde', driver: { java: 'System.out.print(Solution.join(new String[]{"ab","cd","e"}));', python: 'print(join(["ab","cd","e"]))', c: 'printf("%s",join((char*[]){"ab","cd","e"},3));' } },
  code: {
    java: { correct: `
class Solution {
    static String join(String[] parts) {
        StringBuilder b=new StringBuilder();
        for(String p:parts)b.append(p);
        return b.toString();
    }
}
`, bugs: { 3: { was: 'StringBuilder b=new StringBuilder();', buggy: 'StringBuilder b=new StringBuilder("x");' } } },
    python: { correct: `
def join(parts):
    result = []
    for part in parts:
        result.append(part)
    return ''.join(result)
`, bugs: { 4: { was: 'result.append(part)', buggy: 'result = [part]' } } },
    c: { correct: `
char *join(char *parts[],int n) {
    static char out[100000];
    int k=0;
    out[0]='\\0';
    for(int i=0;i<n;i++)for(int j=0;parts[i][j];j++)out[k++]=parts[i][j];
    out[k]='\\0';
    return out;
}
`, bugs: { 5: { was: 'for(int i=0;i<n;i++)for(int j=0;parts[i][j];j++)out[k++]=parts[i][j];', buggy: 'for(int i=0;i<n;i++){k=0;for(int j=0;parts[i][j];j++)out[k++]=parts[i][j];}' } } }
  }
});
