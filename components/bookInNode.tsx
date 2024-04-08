import React, { memo } from "react";
import { CustomNode } from "../app/services/stockAuditService";
import BaseNode from "./baseNode";
import { Handle, Position } from "@xyflow/react";

type CustomNodeContentProps = Pick<CustomNode, "hub" | "location">;

const BookInNode = ({ data }: { data: CustomNode }) => {
  const props = {
    hub: data.hub,
    location: data.location,
  };
  return (
    <BaseNode
      data={data}
      content={<BookInNodeContent data={props} />}
      handles={<Handles />}
    />
  );
};

const BookInNodeContent = ({ data }: { data: CustomNodeContentProps }) => {
  return (
    <div>
      <div>Location - {data.location}</div>
    </div>
  );
};

const Handles = () => {
  return (
    <>
      <Handle type="target" position={Position.Top} className="w-16 bg-white" />
    </>
  );
};

export default memo(BookInNode);
