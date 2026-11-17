import { problems } from '../../data/problemRegistry';
import { useApp } from '../../app/providers/context';
import { PageHeader } from '../../components/common/PageHeader';
import { ProblemList } from '../problems/ProblemList';

export function BookmarksPage() {
  const { bookmarks } = useApp();
  const items = problems.filter((p) => bookmarks.includes(p.id));
  return (
    <>
      <PageHeader title="Bookmarks" subtitle={`${items.length} saved`} />
      <ProblemList items={items} empty="Nothing saved yet. Use the bookmark icon on any problem." />
    </>
  );
}
