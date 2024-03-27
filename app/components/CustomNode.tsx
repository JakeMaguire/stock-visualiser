import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { NodeData } from "../services/NodeService";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const colorMap = {
  goodsIn: "bg-blue-500",
  move: "bg-green-500",
  delivery: "bg-yellow-500",
  bookIn: "bg-purple-500",
  palletMove: "bg-red-500",
  transit: "bg-gray-500",
} as const;

const CustomNode = ({ data }: { data: NodeData }) => {
  return (
    <div>
      <div className="shadow-md rounded-2xl bg-[#1e1e1e] border border-[#b07ff5] text-[#e5e4e7]">
        <Card className="w-[350px]">
          <CardHeader>
            <div className="capitalize text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div
                  className={`${colorMap[data.moveType]} rounded-sm h-9 w-9 flex justify-center items-center`}>
                  <FontAwesomeIcon className="text-white" icon={data.icon} />
                </div>
                <div>{data.moveType}</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-xl font-semibold leading-none tracking-tight">
            <div>Hub - {data.hub}</div>
            <div>Location - {data.location}</div>
          </CardContent>
          <Separator />
          <CardFooter className="flex justify-between text-sm text-muted-foreground pt-6">
            <div>Jake Maguire</div>
            <div>21 July 2023 : 12:02</div>
          </CardFooter>
        </Card>

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
      <div className="text-xs text-center mt-2 p-1 bg-[#b07ff5] text-black">
        Case was broken down
      </div>
    );
  }
};

export default memo(CustomNode);
