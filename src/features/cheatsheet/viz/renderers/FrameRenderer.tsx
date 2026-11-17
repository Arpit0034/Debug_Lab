import type { Frame } from '../types';
import { ArrayRenderer } from './ArrayRenderer';
import { TableRenderer } from './TableRenderer';
import { GraphRenderer } from './GraphRenderer';
import { TreeRenderer } from './TreeRenderer';

export function FrameRenderer({ frame }: { frame: Frame }): React.ReactElement {
  if (frame.data.kind === 'array') return <ArrayRenderer frame={frame} />;
  if (frame.data.kind === 'table') return <TableRenderer frame={frame} />;
  if (frame.data.kind === 'graph') return <GraphRenderer frame={frame} />;
  return <TreeRenderer frame={frame} />;
}
