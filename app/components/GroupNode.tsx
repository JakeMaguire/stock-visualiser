import React, { memo } from "react";

export type Data = {
  data: {
    hub?: number;
    location: string;
    moveType: string;
    emoji?: string;
    time: string;
  };
};

const GroupNode = ({ data }: Data) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400 text-xl"></div>
  );
};

export default memo(GroupNode);
