"use client";

import {
  ReactFlow,
  Controls,
  Background,
  Node as FlowNode,
  Edge,
  EdgeTypes,
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
import CustomEdge from "../components/customEdge";
import brokenDownNode from "../components/brokenDownNode";
import { toast } from "sonner";

const nodeTypes = {
  custom: CustomNode,
  delivery: DeliveryNode,
  brokenDown: brokenDownNode,
  adjustment: CustomNode,
};

const edgeTypes: EdgeTypes = {
  bookIn: CustomEdge,
  adjustment: CustomEdge,
};

export default function Home() {
  const caseLabel = useSearchStore((state) => state.caseLabel);

  const [nodes, setNodes] = useState<FlowNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const initialNodesAndEdges = await getNodesAndEdges(caseLabel);

        setNodes(initialNodesAndEdges.nodes);
        setEdges(initialNodesAndEdges.edges);
      } catch (error) {
        toast("Something went wrong", {
          description: "Unable to find the case label. Please try again.",
          action: {
            label: "Clear",
            onClick: () => console.log("Undo"),
          },
        });
      }
    }

    fetchData();
  }, [caseLabel]);

  console.log("EDGES", edges);

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
          edgeTypes={edgeTypes}
          colorMode="dark">
          <Background />
          <Controls position="bottom-right" />
          <NodePositioner />
        </ReactFlow>
      </Suspense>
    </div>
  );
}
