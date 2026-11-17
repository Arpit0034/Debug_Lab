import type { ConceptCategoryId } from '../types';

export const CATEGORY_LABEL: Record<ConceptCategoryId, string> = {
  foundations: 'Foundations',
  'data-structures': 'Data Structures',
  algorithms: 'Algorithms',
  techniques: 'Techniques',
  paradigms: 'Paradigms',
  advanced: 'Advanced',
};

export const CATEGORY_ORDER: ConceptCategoryId[] = [
  'foundations',
  'data-structures',
  'algorithms',
  'techniques',
  'paradigms',
  'advanced',
];
