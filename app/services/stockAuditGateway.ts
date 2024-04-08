import { GetNodesResponse } from "./stockAuditService";

export const fetchStockAuditData = async (containerLabel: string) => {
  // todo - replace static container label with dynamic value
  const response = await fetch(
    `http://localhost:3000/stock/audit?container_label=${containerLabel}`,
    {
      method: "GET",
    }
  );

  return (await response.json()) as GetNodesResponse;
};
