"use client";

import {
  ReactFlow,
  Controls,
  Background,
  Node as FlowNode,
  Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import CustomNode from "../components/customNode";
import { getNodesAndEdges } from "./services/stockAuditService";
import DeliveryNode from "../components/deliveryNode";
import NodePositioner from "../components/nodesFormatter";
import { Suspense, useEffect, useState } from "react";
import SideBar from "../components/sidebar";
import useSearchStore from "./stores/store";

const nodeTypes = {
  custom: CustomNode,
  delivery: DeliveryNode,
};

export default function Home() {
  const caseLabel = useSearchStore((state) => state.caseLabel);

  const [nodes, setNodes] = useState<FlowNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    async function fetchData() {
      const initialNodesAndEdges = await getNodesAndEdges(caseLabel);
      setNodes(initialNodesAndEdges.nodes);
      setEdges(initialNodesAndEdges.edges);
    }

    fetchData();
  }, [caseLabel]);

  return (
    <div className="h-screen w-screen flex">
      <SideBar />

      {/* Get suspense working */}
      <Suspense
        fallback={<div className="text-3xl text-white">Loading...</div>}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          colorMode="dark">
          <Background />
          <Controls position="bottom-right" />
          <NodePositioner />
        </ReactFlow>
      </Suspense>
    </div>
  );
}
