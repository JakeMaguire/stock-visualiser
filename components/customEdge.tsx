import React, { FC } from "react";
import {
  EdgeProps,
  getBezierPath,
  EdgeLabelRenderer,
  BaseEdge,
} from "@xyflow/react";
import { Badge } from "./ui/badge";

type EdgeData = {
  adjustedQuantity: number;
};

// Extending EdgeProps to include custom data type
interface CustomEdgeProps extends EdgeProps {
  data: EdgeData;
}

const CustomEdge: FC<CustomEdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const labelColor = getQuantityLabelColor(data.adjustedQuantity);

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          strokeWidth: 3,
          stroke: "#f57fd4",
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
          className="absolute nodrag nopan p-4 rounded-md z-10">
          <Badge className={`${labelColor}`}>{data.adjustedQuantity}</Badge>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

const getQuantityLabelColor = (quantity: number) => {
  if (quantity > 0) {
    return "bg-green-500";
  } else if (quantity < 0) {
    return "bg-red-500";
  } else {
    return "bg-gray-500";
  }
};

export default CustomEdge;
