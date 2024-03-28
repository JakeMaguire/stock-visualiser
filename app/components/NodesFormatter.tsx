import { groupBy } from "lodash";
import { useEffect } from "react";
import { getNodesBounds, useNodes, useReactFlow } from "@xyflow/react";

// Padding applied to the parent node to fit in children
const X_PADDING = 40;
const Y_PADDING = 135;
let currentXValue = 0;

export default function NodePositioner() {
  const reactFlow = useReactFlow();
  const nodes = useNodes();

  // Groups nodes by site
  const groupedNodes = groupBy(nodes, "data.siteId");

  // Position nodes based off of rendered height and width
  useEffect(() => {
    // If no nodes are present, return
    if (!nodes.length) return;

    const deliveryNode = nodes.filter((node) => node.type === "delivery");

    if (deliveryNode[0] && deliveryNode[0].computed) {
      currentXValue = (deliveryNode[0]?.computed.width || 0) + X_PADDING;
      deliveryNode[0].computed.positionAbsolute = {
        x: 0,
        y: 100,
      };
    }

    Object.keys(groupedNodes).forEach((key) => {
      if (key !== "undefined") {
        // Gets the bounds of all children nodes to rezise site node to fit children
        const bounds = getNodesBounds(groupedNodes[key]);
        const parentNodeIndex = nodes.findIndex(
          (node) => node.id === `site-${key}`
        );
        const siteNode = nodes[parentNodeIndex];

        const position = { ...siteNode.position };

        // If we have moved past the first site add the size of the previous site to the x value
        if (currentXValue > 0) {
          position.x = currentXValue;

          if (siteNode.computed) {
            siteNode.computed.positionAbsolute = {
              ...position,
            };

            siteNode.height = bounds.height + Y_PADDING;
            siteNode.width = bounds.width + X_PADDING;
          }
          siteNode.position = {
            ...position,
          };
        }

        currentXValue = position.x + bounds.width + X_PADDING + 60;

        // Position children inside the site parent node
        let yPosition = 100;
        groupedNodes[key].forEach((node) => {
          node.position = {
            x: 20,
            y: yPosition,
          };
          node.parentNode = siteNode.id;
          node.zIndex = 1;
          yPosition += 300;
        });
      }
    });

    // Resizes the default view to fit the repositioned nodes
    reactFlow.fitView({
      padding: 0.6,
    });
  }, [groupedNodes, nodes, reactFlow]);

  return null;
}
