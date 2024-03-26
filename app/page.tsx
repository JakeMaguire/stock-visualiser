"use client";

import {
  ReactFlow,
  Controls,
  Background,
  Panel,
  Node as FlowNode,
  Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import CustomNode from "./components/CustomNode";
import { getNodesAndEdges } from "./services/NodeService";
import DeliveryNode from "./components/DeliveryNode";
import TransitNode from "./components/TransitNode";
import NodePositioner from "./components/NodesFormatter";
import { useEffect, useState } from "react";

const nodeTypes = {
  custom: CustomNode,
  delivery: DeliveryNode,
  transit: TransitNode,
};

export default function Home() {
  const [nodes, setNodes] = useState<FlowNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    async function fetchData() {
      const initialNodesAndEdges = await getNodesAndEdges(inputValue);
      setNodes(initialNodesAndEdges.nodes);
      setEdges(initialNodesAndEdges.edges);
    }

    fetchData();
  }, [inputValue]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    console.log(event.target.value);
  };

  return (
    <div className="h-screen w-screen">
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes}>
        <Panel position="top-center">
          Case Label -{" "}
          <input type="text" value={inputValue} onChange={handleInputChange} />
        </Panel>
        <Background />
        <Controls />
        <NodePositioner />
      </ReactFlow>
    </div>
  );
}
