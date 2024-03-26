import { Edge, Node } from "@xyflow/react";
import { fetchStockAuditData } from "./NodeApi";

type MoveTypes =
  | "goodsIn"
  | "move"
  | "delivery"
  | "bookIn"
  | "palletMove"
  | "transit";

export type GetNodesResponse = {
  containerId: number | null;
  containerLabel: string | null;
  events: NodeEvent[];
};

export type NodeEvent = {
  id: number;
  type: MoveTypes;
  quantity: number;
  user: string;
  fromLocation?: {
    siteId: number;
    siteName: string;
    locationId: number;
    locationName: string;
    hub: number;
  } | null;
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

export type NodeData = {
  siteId?: number;
  siteName?: string;
  hub?: number | null;
  location?: string;
  moveType: string;
  emoji?: string;
  time: string;
  wasBrokenDown: boolean;
};

type Site = {
  siteId: number;
  siteName: string;
  nodeId: string;
};

type NodesAndEdges = {
  nodes: Node[];
  edges: Edge[];
};

// todo - switch to material icons
const typeEmojiMapper = {
  goodsIn: "📋",
  move: "📦",
  delivery: "🚛",
  transit: "🚛",
  bookIn: "📖",
  palletMove: "📦📦",
} as const;

export const getNodesAndEdges = async (
  containerLabel: string
): Promise<NodesAndEdges> => {
  const response = await fetchStockAuditData(containerLabel);
  console.log("RESPONSE", response);

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
          const edge = constructEdge(prevNodeId, moveNode.id);
          edges.push(edge);
        }

        prevNodeId = moveNode.id;
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
    className: "light",
    style: { width: 300, height: 500 },
  };
};

const constructDeliveryNode = (
  node: NodeEvent,
  parentNodeId?: string
): Node => {
  return {
    id: node.id.toString(),
    type: "delivery",
    position: { x: 0, y: 0 },
    data: {
      deliveryId: node.id,
      emoji: typeEmojiMapper[node.type],
      time: node.eventTime,
    },
    parentNode: parentNodeId,
  };
};

const constructNode = (
  node: NodeEvent,
  parentNodeId?: string
): Node<NodeData> => {
  return {
    id: node.id.toString(),
    type: "custom",
    position: { x: 0, y: 0 },
    data: {
      siteId: node.toLocation?.siteId,
      siteName: node.toLocation?.siteName,
      hub: node.toLocation?.hub,
      location: node.toLocation?.locationName,
      moveType: node.type,
      emoji: typeEmojiMapper[node.type],
      time: node.eventTime,
      wasBrokenDown: node.type === "bookIn", //todo - need to fix this
    },
    parentNode: parentNodeId,
    zIndex: 1,
  };
};

const constructEdge = (prevNode: string, currentNode: string): Edge => {
  return {
    id: `${prevNode}-${currentNode}`,
    source: prevNode,
    target: currentNode,
    zIndex: 1,
    animated: true,
  };
};

const isNewSite = (sites: Site[], node: NodeEvent) => {
  return !sites.find((site) => site.siteId === node.toLocation?.siteId);
};
