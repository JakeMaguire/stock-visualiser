import { Edge, Node } from "reactflow";
import { getNodes } from "./NodeApi";

type MoveTypes =
  | "goodsIn"
  | "move"
  | "delivery"
  | "bookIn"
  | "palletMove"
  | "transit";

export type GetNodesResponse = {
  id: number;
  caseId: number | null;
  caseLabel: string | null;
  locationFrom?: {
    id: number;
    name: string;
    hub: number;
    siteId: number;
    siteName: string;
    type: number;
  } | null;
  locationTo: {
    id: number;
    name: string;
    hub: number | null;
    siteId: number;
    siteName: string;
    type: number;
  } | null;
  type: MoveTypes;
  quantity: number;
  user: string;
  time: string;
};

type Site = {
  siteId: number;
  nodeId: string;
};

type NodesAndEdges = {
  nodes: Node[];
  edges: Edge[];
};

const typeEmojiMapper = {
  goodsIn: "📋",
  move: "📦",
  delivery: "🚛",
  transit: "🚛",
  bookIn: "📖",
  palletMove: "📦📦",
} as const;

export const convertToNodes = (): NodesAndEdges => {
  const response = getNodes();

  let yPosition = 50;
  let groupXPosition = 300;
  let sites: Site[] = [];
  let transformedNodes: Node[] = [];
  let edges: Edge[] = [];
  let prevNodeId: string;

  response.forEach((node) => {
    // If location from is undefined we assume it is a delivery
    if (node.type === "delivery") {
      const transformedNode = constructDeliveryNode(node, 150);

      if (prevNodeId) {
        const edge = constructEdge(prevNodeId, transformedNode.id);
        edges.push(edge);
      }
      prevNodeId = transformedNode.id;
      transformedNodes.push(transformedNode);

      return;
    }

    if (node.type === "goodsIn") {
      if (node.locationTo && isNewSite(sites, node)) {
        const nodeId = `site-${node.locationTo.siteId}`;
        const groupNode = constructGroupNode(nodeId, node, groupXPosition);

        transformedNodes.push(groupNode);
        sites.push({
          siteId: node.locationTo.siteId,
          nodeId,
        });

        groupXPosition += 400;
      }

      const parentNode = sites.find(
        (site) => site.siteId === node.locationTo?.siteId
      );

      const transformedNode = constructNode(
        node,
        yPosition,
        parentNode?.nodeId
      );
      transformedNodes.push(transformedNode);

      if (prevNodeId) {
        const edge = constructEdge(prevNodeId, transformedNode.id);
        edges.push(edge);
      }

      prevNodeId = transformedNode.id;

      yPosition += 120;
      return;
    } else if (node.locationTo) {
      if (isNewSite(sites, node)) {
        const nodeId = `site-${node.locationTo.siteId}`;
        const groupNode = constructGroupNode(nodeId, node, groupXPosition);

        transformedNodes.push(groupNode);
        sites.push({
          siteId: node.locationTo.siteId,
          nodeId,
        });
        groupXPosition += 400;
        yPosition = 50;
      }

      const parentNode = sites.find(
        (site) => site.siteId === node.locationTo?.siteId
      );

      const transformedNode = constructNode(
        node,
        yPosition,
        parentNode?.nodeId
      );
      transformedNodes.push(transformedNode);

      if (prevNodeId) {
        const edge = constructEdge(prevNodeId, transformedNode.id);
        edges.push(edge);
      }

      prevNodeId = transformedNode.id;
      yPosition += 120;
      return;
    }
  });

  return { nodes: transformedNodes, edges };
};

const constructGroupNode = (
  id: string,
  node: GetNodesResponse,
  groupXPosition: number
) => {
  return {
    id,
    data: { label: node.locationTo?.siteName },
    position: { x: groupXPosition, y: 100 },
    className: "light",
    style: { width: 300, height: 500 },
    // type: "group",
  };
};

const constructDeliveryNode = (
  node: GetNodesResponse,
  yPosition: number,
  parentNodeId?: string
) => {
  return {
    id: node.id.toString(),
    type: "delivery",
    position: { x: 10, y: yPosition },
    data: {
      deliveryId: node.id,
      emoji: typeEmojiMapper[node.type],
      time: node.time,
    },
    parentNode: parentNodeId,
  };
};

const constructNode = (
  node: GetNodesResponse,
  yPosition: number,
  parentNodeId?: string
): Node => {
  return {
    id: node.id.toString(),
    type: "custom",
    position: { x: 10, y: yPosition },
    data: {
      hub: node.locationTo?.hub,
      location: node.locationTo?.name,
      moveType: node.type,
      emoji: typeEmojiMapper[node.type],
      time: node.time,
      wasBrokenDown: node.type === "bookIn", //todo - need to fix this
    },
    parentNode: parentNodeId,
  };
};

const constructEdge = (prevNode: string, currentNode: string): Edge => {
  return {
    id: `${prevNode}-${currentNode}`,
    source: prevNode,
    target: currentNode,
    zIndex: 1,
  };
};

const isNewSite = (sites: Site[], node: GetNodesResponse) => {
  return !sites.find((site) => site.siteId === node.locationTo?.siteId);
};
