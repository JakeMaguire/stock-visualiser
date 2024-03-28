import React, { memo } from "react";
import { DeliveryNode } from "../app/services/stockAuditService";
import BaseNode from "./baseNode";
import { Handle, Position } from "@xyflow/react";

type DeliveryNodeContentProps = Pick<DeliveryNode, "deliveryId">;

const DeliveryNode = ({ data }: { data: DeliveryNode }) => {
  const props = {
    deliveryId: data.deliveryId,
  };

  return (
    <BaseNode
      data={data}
      content={<DeliveryNodeContent data={props} />}
      handles={<Handles />}
    />
  );
};

const DeliveryNodeContent = ({ data }: { data: DeliveryNodeContentProps }) => {
  return (
    <div>
      <div>Delivery ID - {data.deliveryId}</div>
      <div>SKU - Box of revels</div>
    </div>
  );
};

const Handles = () => {
  return (
    <Handle type="source" position={Position.Right} className="w-16 bg-white" />
  );
};

export default memo(DeliveryNode);
