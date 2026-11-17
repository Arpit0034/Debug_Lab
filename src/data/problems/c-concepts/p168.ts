import { defineProblem } from '../../defineProblem';

export default defineProblem({
  id: 'p168',
  title: 'The character counter stops at a space',
  difficulty: 'Easy',
  topic: 'C Concepts',
  subtopic: 'String Traversal',
  tags: ['C', 'Strings', 'Null Terminator'],
  bugCategory: 'Incorrect Loop Boundary',
  sourceInspiredBy: 'Counting alphabetic characters in a C string',
  description: 'Count the alphabetic characters in a null-terminated string. Spaces and punctuation are not counted.',
  constraints: ['String length <= 10000', 'Input is ASCII'],
  examples: [{ input: '"hi there!"', output: '7' }],
  hints: ['A C string ends at its terminator, not at whitespace.', 'The character classification must ignore punctuation.'],
  complexity: { time: 'O(n)', space: 'O(1)' },
  explanation: {
    overview: 'Count letters throughout the complete string.',
    algorithm: 'Scan until the null terminator and count alphabetic characters.',
    bug: 'The loop condition stops when a space is encountered.',
    whyItFails: 'Characters after the first space are never visited.',
    failingTestCase: '"hi there!" should count seven letters.',
    fix: 'Continue while the current character is not the null terminator.',
    whyFixWorks: 'The entire string is traversed, including spaces and punctuation.',
    dryRun: 'The scan passes the space and counts the five letters in "there".',
    debuggingLesson: 'Whitespace is valid string content; only the terminator ends a C string.'
  },
  testCases: [{ input: '"hi there!"', expected: '7' }],
  harness: { expected: '7', driver: { java: 'System.out.print(Solution.countLetters("hi there!"));', python: 'print(count_letters("hi there!"))', c: 'printf("%d",count_letters("hi there!"));' } },
  code: {
    java: { correct: `
class Solution {
    static int countLetters(String s) {
        int count=0;
        for(int i=0;i<s.length();i++)if(Character.isLetter(s.charAt(i)))count++;
        return count;
    }
}
`, bugs: { 4: { was: 'for(int i=0;i<s.length();i++)if(Character.isLetter(s.charAt(i)))count++;', buggy: 'for(int i=0;i<s.indexOf(" ");i++)if(Character.isLetter(s.charAt(i)))count++;' } } },
    python: { correct: `
def count_letters(s):
    return sum(1 for ch in s if ch.isalpha())
`, bugs: { 2: { was: 'return sum(1 for ch in s if ch.isalpha())', buggy: 'return sum(1 for ch in s.split()[0] if ch.isalpha())' } } },
    c: { correct: `
int count_letters(char *s) {
    int count=0;
    for(int i=0;s[i]!='\\0';i++)
        if((s[i]>='A'&&s[i]<='Z')||(s[i]>='a'&&s[i]<='z'))count++;
    return count;
}
`, bugs: { 3: { was: "for(int i=0;s[i]!='\\0';i++)", buggy: "for(int i=0;s[i]!=' ' && s[i]!='\\0';i++)" } } }
  }
});
