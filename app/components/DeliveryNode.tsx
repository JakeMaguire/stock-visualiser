import React, { memo } from "react";
import { Handle, Position } from "reactflow";

export type Data = {
  data: {
    deliveryId: number;
    emoji?: string;
    time: string;
  };
};

const CustomNode = ({ data }: Data) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400">
      <div className="flex">
        <div className="flex items-center mr-1">
          <div className="rounded-full w-12 h-12 flex justify-center items-center bg-gray-100">
            {data.emoji}
          </div>
        </div>
        <div className="ml-2 text-sm">
          <div className="text-gray-500 capitalize text-xs">Delivery</div>
          <div className="font-bold">Delivery ID: {data.deliveryId}</div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="w-16 !bg-teal-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-16 !bg-teal-500"
      />
    </div>
  );
};

export default memo(CustomNode);
