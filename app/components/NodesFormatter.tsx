import { groupBy } from "lodash";
import { useEffect } from "react";
import { getNodesBounds, useNodes, useReactFlow } from "reactflow";

export default function NodePositioner() {
  const reactFlow = useReactFlow();
  const nodes = useNodes();

  // Groups nodes by site
  const groupedNodes = groupBy(nodes, "data.siteId");

  // Position nodes based off of rendered height and width
  useEffect(() => {
    // If no nodes are present, return
    if (!nodes.length) return;

    // Padding applied to the parent node to fit in children
    const xPadding = 40;
    const yPadding = 65;

    const deliveryNode = nodes.filter((node) => node.type === "delivery");

    let currentXValue =
      deliveryNode.length > 0 ? (deliveryNode[0]?.width || 0) + xPadding : 0;

    Object.keys(groupedNodes).forEach((key) => {
      if (key !== "undefined") {
        // Gets the bounds of all children nodes
        const bounds = getNodesBounds(groupedNodes[key]);
        const parentNodeIndex = nodes.findIndex(
          (node) => node.id === `site-${key}`
        );

        // Now we know the outer bounds of the children nodes, we can set the size of the parent node to fit
        nodes[parentNodeIndex].style = {
          width: bounds.width + xPadding,
          height: bounds.height + yPadding,
        };

        const position = { ...nodes[parentNodeIndex].position };

        // If we have moved past the first site add the size of the previous site to the x value
        if (currentXValue > 0) {
          position.x = currentXValue;
          nodes[parentNodeIndex].positionAbsolute = {
            ...position,
          };
          nodes[parentNodeIndex].position = {
            ...position,
          };
        }

        currentXValue = position.x + bounds.width + xPadding + 60;
      }
    });

    // Resizes the default view to fit the repositioned nodes
    reactFlow.fitView({
      padding: 0.3,
    });
  }, [groupedNodes, nodes, reactFlow]);

  return null;
}
