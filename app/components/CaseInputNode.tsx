import React, { memo } from "react";
import { NodeData } from "../services/NodeService";

const CaseInputNode = ({ data }: { data: NodeData }) => {
  return (
    <div>
      <div className="px-4 py-2 shadow-md bg-white border border-stone-500">
        <input type="text"></input>
      </div>
    </div>
  );
};

export default memo(CaseInputNode);
