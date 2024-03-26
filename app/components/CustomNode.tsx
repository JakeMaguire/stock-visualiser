import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { NodeData } from "../services/NodeService";

const CustomNode = ({ data }: { data: NodeData }) => {
  return (
    <div>
      <div className="px-4 py-2 shadow-md bg-white border border-stone-500">
        <div className="flex">
          <div className="flex items-center mr-1">
            <div className="rounded-full w-12 h-12 flex justify-center text-xl items-center bg-gray-100">
              {data.emoji}
            </div>
          </div>
          <div className="ml-2 text-sm">
            <div className="text-gray-500 capitalize text-xs">
              {data.moveType}
            </div>

            <div>
              <span className="font-bold">Hub - </span>
              {data.hub}
            </div>

            <div>
              <span className="font-bold">Location - </span>
              {data.location}
            </div>
          </div>
        </div>

        <div className="flex space-x-2 text-xs mt-2 text-gray-500">
          <span>Jake Maguire</span>
          <span>-</span>
          <span>21 April 2023</span>
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

      <BrokenDown brokenDown={data.wasBrokenDown} />
    </div>
  );
};

const BrokenDown = ({ brokenDown }: { brokenDown: boolean }) => {
  if (brokenDown) {
    return (
      <div className="text-xs text-center mt-2 p-1 bg-blue-200">
        Case was broken down
      </div>
    );
  }
};

export default memo(CustomNode);
