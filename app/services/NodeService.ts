import { Edge, Node } from "@xyflow/react";
import { fetchStockAuditData } from "./NodeApi";
import {
  faTruckRampBox,
  faArrowRight,
  faDolly,
  faTruck,
  faBoxOpen,
  IconDefinition,
  faBoxesStacked,
  faPeopleCarryBox,
} from "@fortawesome/free-solid-svg-icons";

type MoveType =
  | "goodsIn"
  | "move"
  | "delivery"
  | "bookIn"
  | "palletMove"
  | "crossStock"
  | "transit";

export type GetNodesResponse = {
  containerId: number | null;
  containerLabel: string | null;
  events: AuditEvent[];
};

export type DeliveryNodeData = {
  deliveryId: number;
  moveType: MoveType;
  icon: IconDefinition;
  time: string;
};

export type AuditEvent = {
  id: number;
  type: MoveType;
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
  moveType: MoveType;
  icon: IconDefinition;
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

const iconMap: Record<string, IconDefinition> = {
  delivery: faTruckRampBox,
  goodsIn: faDolly,
  move: faArrowRight,
  transit: faTruck,
  bookIn: faBoxOpen,
  palletMove: faBoxesStacked,
  crossStock: faPeopleCarryBox,
} as const;

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
    // todo - move style out of here and into a custom group node component
    style: {
      background: "none",
      textAlign: "left",
      paddingLeft: 20,
      paddingTop: 30,
      fontSize: 24,
      fontWeight: "bold",
    },
  };
};

const constructDeliveryNode = (
  node: AuditEvent,
  parentNodeId?: string
): Node<DeliveryNodeData> => {
  console.log(iconMap);
  console.log(node.type);
  console.log(iconMap[node.type]);
  return {
    id: node.id.toString(),
    type: node.type,
    position: { x: 0, y: 0 },
    data: {
      deliveryId: node.id,
      moveType: node.type,
      icon: iconMap[node.type],
      time: node.eventTime,
    },
    parentNode: parentNodeId,
  };
};

const constructNode = (
  node: AuditEvent,
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
      icon: iconMap[node.type],
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
    style: {
      stroke: "#f57fd4",
      strokeWidth: 2,
    },
  };
};

const isNewSite = (sites: Site[], node: AuditEvent) => {
  return !sites.find((site) => site.siteId === node.toLocation?.siteId);
};
