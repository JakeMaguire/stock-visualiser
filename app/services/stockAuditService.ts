import { Edge, Node } from "@xyflow/react";
import { fetchStockAuditData } from "./stockAuditGateway";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import iconMap from "../utils/IconMapper";
import dayjs from "dayjs";

export type MoveType =
  | "goodsIn"
  | "move"
  | "delivery"
  | "bookIn"
  | "palletMove"
  | "crossStock"
  | "transit"
  | "brokenDown"
  | "adjustment";

export type GetNodesResponse = {
  containerId: number | null;
  containerLabel: string | null;
  events: AuditEvent[];
};

export type AuditEvent = {
  id: number;
  type: MoveType;
  caseQuantity: number;
  user: string;
  deliveryId: number | null;
  adjustedQuantity: number | null;
  sku: string | null;
  toLocation: {
    siteId: number;
    siteName: string;
    locationId: number;
    locationName: string;
    hub: number;
  } | null;
  eventTime: string;
  createdAt: string;
};

export type BaseNodeData = {
  moveType: MoveType;
  icon: IconDefinition;
  time: string;
  user: string;
  caseQuantity: number | null;
};

type DeliveryNodeData = {
  deliveryId: number | null;
  sku: string | null;
};

export type DeliveryNode = BaseNodeData & DeliveryNodeData;

type CustomNodeData = {
  siteId?: number;
  siteName?: string;
  hub?: number | null;
  location?: string;
  adjustedQuantity?: number | null;
};

export type CustomNode = BaseNodeData & CustomNodeData;

type Site = {
  siteId: number;
  siteName: string;
  nodeId: string;
};

type NodesAndEdges = {
  nodes: Node[];
  edges: Edge[];
};

export const getNodesAndEdges = async (
  containerLabel: string
): Promise<NodesAndEdges> => {
  const response = await fetchStockAuditData(containerLabel);

  const nodes: Node[] = [];
  let sites: Site[] = [];
  let edges: Edge[] = [];
  let prevNodeId: string;

  response?.events.forEach((node) => {
    switch (node.type) {
      case "delivery":
        const deliveryNode = constructDeliveryNode(node);

        if (prevNodeId) {
          const edge = constructEdge(prevNodeId, deliveryNode.id);
          edges.push(edge);
        }

        prevNodeId = deliveryNode.id;
        nodes.push(deliveryNode);
        break;
      case "brokenDown":
        const brokenDownNode = constructBrokenDownNode(node);
        nodes.push(brokenDownNode);

        if (prevNodeId) {
          const edge = constructEdge(prevNodeId, brokenDownNode.id, node.type);
          edges.push(edge);
        }

        break;
      default:
        if (node.toLocation && isNewSite(sites, node)) {
          const nodeId = `site-${node.toLocation.siteId}`;

          sites.push({
            siteId: node.toLocation.siteId,
            siteName: node.toLocation.siteName,
            nodeId,
          });

          const siteNode = constructGroupNode(nodeId, node.toLocation.siteName);
          nodes.push(siteNode);
        }

        const moveNode = constructNode(node);
        nodes.push(moveNode);

        if (prevNodeId) {
          const edge = constructEdge(
            prevNodeId,
            moveNode.id,
            node.type,
            node.adjustedQuantity
          );
          edges.push(edge);
        }

        if (node.type !== "bookIn") prevNodeId = moveNode.id;
    }
  });

  return { nodes, edges };
};

const constructGroupNode = (
  id: string,
  label: string,
  groupXPosition?: number
): Node => {
  return {
    id,
    data: { label },
    position: { x: groupXPosition ?? 0, y: 0 },
    // todo - move style out of here and into a custom group node component
    style: {
      background: "none",
      textAlign: "left",
      paddingLeft: 20,
      paddingTop: 30,
      fontSize: 24,
      fontWeight: "bold",
      borderRadius: 10,
      borderColor: "#78716c",
    },
  };
};

const constructDeliveryNode = (
  node: AuditEvent,
  parentNodeId?: string
): Node<DeliveryNode> => {
  return {
    id: node.id.toString(),
    type: node.type,
    position: { x: 0, y: 0 },
    data: {
      deliveryId: node.deliveryId,
      caseQuantity: node.caseQuantity,
      sku: node.sku,
      moveType: node.type,
      icon: iconMap[node.type],
      time: dayjs(node.eventTime).format("DD MMM YYYY : HH:mm"),
      user: node.user,
    },
    parentNode: parentNodeId,
  };
};

const constructBrokenDownNode = (
  node: AuditEvent,
  parentNodeId?: string
): Node<CustomNode> => {
  console.log("CREATING BROKEN DOWN NODE");
  return {
    id: node.id.toString(),
    type: node.type,
    position: { x: 0, y: 0 },
    data: {
      siteId: node.toLocation?.siteId,
      siteName: node.toLocation?.siteName,
      hub: node.toLocation?.hub,
      location: node.toLocation?.locationName,
      caseQuantity: node.caseQuantity,
      moveType: node.type,
      icon: iconMap[node.type],
      time: dayjs(node.eventTime).format("DD MMM YYYY : HH:mm"),
      user: node.user,
    },
    parentNode: parentNodeId,
  };
};

const constructNode = (
  node: AuditEvent,
  parentNodeId?: string
): Node<CustomNode> => {
  return {
    id: node.id.toString(),
    type: "custom",
    position: { x: 0, y: 0 },
    data: {
      siteId: node.toLocation?.siteId,
      siteName: node.toLocation?.siteName,
      hub: node.toLocation?.hub,
      location: node.toLocation?.locationName,
      caseQuantity: node.caseQuantity,
      adjustedQuantity: node.adjustedQuantity,
      moveType: node.type,
      icon: iconMap[node.type],
      time: dayjs(node.eventTime).format("DD MMM YYYY : HH:mm"),
      user: node.user,
    },
    parentNode: parentNodeId,
    zIndex: 1,
  };
};

const constructEdge = (
  prevNode: string,
  currentNode: string,
  type?: MoveType,
  adjustedQuantity?: number | null
): Edge => {
  return {
    id: `${prevNode}-${currentNode}`,
    type,
    source: prevNode,
    target: currentNode,
    zIndex: 1,
    animated: true,
    data: {
      adjustedQuantity,
    },
    style: {
      stroke: "#f57fd4",
      strokeWidth: 3,
    },
  };
};

const isNewSite = (sites: Site[], node: AuditEvent) => {
  return !sites.find((site) => site.siteId === node.toLocation?.siteId);
};
