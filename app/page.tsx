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
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/card";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const nodeTypes = {
  custom: CustomNode,
  delivery: DeliveryNode,
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
  };

  return (
    <div className="h-screen w-screen flex">
      <div className=" w-1/4 bg-[#1e1e1e] text-[#e5e4e7]">
        <h1 className="text-4xl font-extrabold tracking-tight text-center m-4 ">
          Stock Visualiser
        </h1>
        <div className="flex flex-col space-y-2 items-center">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="font-semibold leading-none tracking-tight text-sm">
                Search by Case Label
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Enter a <span className="font-bold">case label</span> below to
                view a history of its movements
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center">
              <FontAwesomeIcon className="absolute pl-2" icon={faSearch} />
              <Input
                type="text"
                placeholder="Enter case label..."
                value={inputValue}
                onChange={handleInputChange}
                className="h-8 text-xs pl-7"
              />
            </CardContent>
          </Card>
        </div>
      </div>
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
