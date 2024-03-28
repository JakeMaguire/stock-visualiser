import React, { memo } from "react";
import { CustomNode } from "../app/services/stockAuditService";
import BaseNode from "./baseNode";
import { Handle, Position } from "@xyflow/react";

type CustomNodeContentProps = Pick<CustomNode, "hub" | "location">;

const CustomNode = ({ data }: { data: CustomNode }) => {
  const props = {
    hub: data.hub,
    location: data.location,
  };
  return (
    <BaseNode
      data={data}
      content={<CustomNodeContent data={props} />}
      handles={<Handles />}
    />
  );
};

const CustomNodeContent = ({ data }: { data: CustomNodeContentProps }) => {
  return (
    <div>
      <div>Hub - {data.hub}</div>
      <div>Location - {data.location}</div>
    </div>
  );
};

const Handles = () => {
  return (
    <>
      <Handle type="target" position={Position.Top} className="w-16 bg-white" />
      <Handle
        type="source"
        position={Position.Bottom}
        className="h-32 w-32 bg-white"
      />
    </>
  );
};

export default memo(CustomNode);
