"use client";

import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useNodes,
  useNodesInitialized,
  useReactFlow,
  getNodesBounds,
  FitViewOptions,
} from "reactflow";
import "reactflow/dist/style.css";
import CustomNode from "./components/CustomNode";
import { getNodesAndEdges } from "./services/NodeService";
import DeliveryNode from "./components/DeliveryNode";
import TransitNode from "./components/TransitNode";
import Nodes from "./components/Nodes";
import { groupBy } from "lodash";
import { useEffect, useState } from "react";

const nodeTypes = {
  custom: CustomNode,
  delivery: DeliveryNode,
  transit: TransitNode,
};

export default function Home() {
  const initialNodesAndEdges = getNodesAndEdges();
  const [nodes, setNodes] = useState(initialNodesAndEdges.nodes);

  const fitViewOptions: FitViewOptions = {
    nodes: nodes,
    padding: 1,
  };

  return (
    <div className="h-screen w-screen">
      <ReactFlow
        nodes={nodes}
        edges={initialNodesAndEdges.edges}
        nodeTypes={nodeTypes}>
        <Background />
        <Controls />
        <Nodes setNodes={setNodes} />
      </ReactFlow>
    </div>
  );
}
