import { Edge, Node, Position } from "reactflow";
import { getNodes } from "./NodeApi";
import { groupBy } from "lodash";

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

const typeEmojiMapper = {
  goodsIn: "📋",
  move: "📦",
  delivery: "🚛",
  transit: "🚛",
  bookIn: "📖",
  palletMove: "📦📦",
} as const;

export const getNodesAndEdges = (): NodesAndEdges => {
  const response = getNodes();

  let sites: Site[] = [];
  let deliveryNodes: Node[] = [];
  let moveNodes: Node[] = [];
  let edges: Edge[] = [];
  let prevNodeId: string;

  response.forEach((node) => {
    switch (node.type) {
      case "delivery":
        const deliveryNode = constructDeliveryNode(node);

        if (prevNodeId) {
          const edge = constructEdge(prevNodeId, deliveryNode.id);
          edges.push(edge);
        }

        prevNodeId = deliveryNode.id;
        deliveryNodes.push(deliveryNode);
        break;
      default:
        if (node.locationTo && isNewSite(sites, node)) {
          const nodeId = `site-${node.locationTo.siteId}`;

          sites.push({
            siteId: node.locationTo.siteId,
            siteName: node.locationTo.siteName,
            nodeId,
          });
        }
        const moveNode = constructNode(node);
        moveNodes.push(moveNode);

        if (prevNodeId) {
          const edge = constructEdge(prevNodeId, moveNode.id);
          edges.push(edge);
        }

        prevNodeId = moveNode.id;
    }
  });

  const repositionedNodes = positionNodes(sites, deliveryNodes, moveNodes);

  return { nodes: repositionedNodes, edges };
};

const positionNodes = (
  sites: Site[],
  deliveryNodes: Node[],
  moveNodes: Node[]
): Node[] => {
  const transformedNodes: Node[] = [];

  // Get Delivery Nodes and Position Them
  let deliveryYPosition = 0;
  deliveryNodes.forEach((node) => {
    if (node.type === "delivery") {
      node.position = {
        x: 0,
        y: deliveryYPosition,
      };

      deliveryYPosition += 100;
    }

    transformedNodes.push(node);
  });

  // Get Sites and construct Group Nodes
  const groupedNodes = groupBy(moveNodes, "data.siteId");

  let siteXPosition = 250;
  sites.forEach((site) => {
    const groupNode = constructGroupNode(
      site.nodeId,
      site.siteName,
      siteXPosition
    );
    transformedNodes.push(groupNode);

    // Get Nodes for each site and position them
    const nodes = groupedNodes[site.siteId];
    if (nodes) {
      let yPosition = 40;
      nodes.forEach((node) => {
        node.position = {
          x: 20,
          y: yPosition,
        };
        node.parentNode = site.nodeId;
        node.zIndex = 1;
        yPosition += 150;
      });

      transformedNodes.push(...nodes);
    }
  });

  return transformedNodes;
};

const constructGroupNode = (
  id: string,
  label: string,
  groupXPosition: number
): Node => {
  return {
    id,
    data: { label },
    position: { x: groupXPosition, y: 0 },
    className: "light",
    style: { width: 300, height: 500 },
    // type: "group",
  };
};

const constructDeliveryNode = (
  node: GetNodesResponse,
  parentNodeId?: string
): Node => {
  return {
    id: node.id.toString(),
    type: "delivery",
    position: { x: 0, y: 0 },
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
  parentNodeId?: string
): Node<NodeData> => {
  return {
    id: node.id.toString(),
    type: "custom",
    position: { x: 0, y: 0 },
    data: {
      siteId: node.locationTo?.siteId,
      siteName: node.locationTo?.siteName,
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
    animated: true,
    sourceHandle: "right",
    targetHandle: "right",
  };
};

const isNewSite = (sites: Site[], node: GetNodesResponse) => {
  return !sites.find((site) => site.siteId === node.locationTo?.siteId);
};
