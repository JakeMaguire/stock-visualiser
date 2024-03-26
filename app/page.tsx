"use client";

import { ReactFlow, Controls, Background, Panel } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import CustomNode from "./components/CustomNode";
import { getNodesAndEdges } from "./services/NodeService";
import DeliveryNode from "./components/DeliveryNode";
import TransitNode from "./components/TransitNode";
import NodePositioner from "./components/NodesFormatter";
import { useState } from "react";

const nodeTypes = {
  custom: CustomNode,
  delivery: DeliveryNode,
  transit: TransitNode,
};

export default function Home() {
  const initialNodesAndEdges = getNodesAndEdges();
  const [nodes, setNodes] = useState(initialNodesAndEdges.nodes);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    console.log(event.target.value);
  };

  console.log(nodes);
  console.log(initialNodesAndEdges.edges);

  return (
    <div className="h-screen w-screen">
      <ReactFlow
        nodes={nodes}
        edges={initialNodesAndEdges.edges}
        nodeTypes={nodeTypes}>
        <Panel position="top-center">
          Case Label -{" "}
          <input type="text" value={inputValue} onSubmit={handleInputChange} />
        </Panel>
        <Background />
        <Controls />
        <NodePositioner />
      </ReactFlow>
    </div>
  );
}
