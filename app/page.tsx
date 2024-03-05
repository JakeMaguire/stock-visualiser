"use client";

import ReactFlow, { Node, Controls, Background } from "reactflow";
import "reactflow/dist/style.css";
import CustomNode from "./components/CustomNode";
import { convertToNodes } from "./services/NodeService";
import DeliveryNode from "./components/DeliveryNode";
import GroupNode from "./components/GroupNode";
import TransitNode from "./components/TransitNode";

const nodeTypes = {
  custom: CustomNode,
  delivery: DeliveryNode,
  transit: TransitNode,
  // group: GroupNode,
};

const edges = [
  { id: "e2a-2b", source: "2a", target: "2b", zIndex: 1 },
  { id: "2b-2c", source: "2b", target: "2c", zIndex: 1 },
  {
    id: "2c-3a",
    source: "2c",
    target: "3a",
    zIndex: 1,
    sourcePosition: "right",
  },
];

export default function Home() {
  const { nodes, edges } = convertToNodes();

  return (
    <div className="h-screen w-screen">
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes}>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
