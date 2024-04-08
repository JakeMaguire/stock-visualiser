import React, { memo } from "react";
import { BaseNodeData } from "../app/services/stockAuditService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const BrokenDownNode = ({ data }: { data: BaseNodeData }) => {
  return (
    <div className="text-xs text-center mt-2 p-2 bg-[#b07ff5] text-black space-x-2 z-100">
      <FontAwesomeIcon className="text-white" icon={data.icon} />
      <span>The case was broken down at {data.time}</span>
    </div>
  );
};

export default memo(BrokenDownNode);
