import { useEffect } from 'react';
import { Graph } from '../../types/types';

import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

export function CharacterGraph({
  gr,
}: { gr: Graph }) {
  if (gr === null) {
    return <div>No data available</div>;
  }

  // Using useNodesState and useEdgesState hooks
  const [nodes, setNodes] = useNodesState(gr.initialNodes);
  const [edges, setEdges] = useEdgesState(gr.initialEdges);

  useEffect(() => {
    setNodes(gr.initialNodes);
    setEdges(gr.initialEdges);
  }, [gr, setNodes, setEdges]);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}