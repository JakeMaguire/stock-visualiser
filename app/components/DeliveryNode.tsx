import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { DeliveryNodeData } from "../services/NodeService";
import { ColorMap } from "../utils/ColorMappers";

const CustomNode = ({ data }: { data: DeliveryNodeData }) => {
  return (
    <div>
      <div className="shadow-md rounded-2xl bg-[#1e1e1e] border border-[#b07ff5] text-[#e5e4e7]">
        <Card className="w-[350px]">
          <CardHeader>
            <div className="capitalize text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div
                  className={`${ColorMap[data.moveType]} rounded-sm h-8 w-8 flex justify-center items-center`}>
                  <FontAwesomeIcon className="text-white" icon={data.icon} />
                </div>
                <div>{data.moveType}</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-xl font-semibold leading-none tracking-tight py-0">
            <div>
              <div>Delivery ID - {data.deliveryId}</div>
              <div>SKU - {data.deliveryId}</div>
            </div>
            <Separator />
            <div className="flex justify-between text-sm text-muted-foreground">
              <div className="flex space-x-2 items-center">
                <FontAwesomeIcon icon={faUser} /> <span>Jake Maguire</span>
              </div>
              <div className="flex space-x-2 items-center">
                <FontAwesomeIcon icon={faCalendarDays} />{" "}
                <span>21 July 2023 : 12:02</span>
              </div>
            </div>
          </CardContent>
          <CardFooter />
        </Card>

        <Handle
          type="source"
          position={Position.Right}
          className="w-16 bg-white"
        />
      </div>
    </div>
  );
};

export default memo(CustomNode);
