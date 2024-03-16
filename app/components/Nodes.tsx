import { groupBy } from "lodash";
import { useEffect } from "react";
import { getNodesBounds, useNodes, useReactFlow } from "reactflow";

export default function Nodes({ setNodes }) {
  const reactFlow = useReactFlow();
  const nodes = useNodes();
  const groupedNodes = groupBy(nodes, "data.siteId");

  useEffect(() => {
    let currentXValue = 0;
    Object.keys(groupedNodes).forEach((key) => {
      if (key !== "undefined") {
        const xPadding = 40;
        const yPadding = 65;
        const bounds = getNodesBounds(groupedNodes[key]);
        const parentNodeIndex = nodes.findIndex(
          (node) => node.id === `site-${key}`
        );

        nodes[parentNodeIndex].style = {
          width: bounds.width + xPadding,
          height: bounds.height + yPadding,
        };

        const position = { ...nodes[parentNodeIndex].position };

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
  }, [groupedNodes, nodes, setNodes, reactFlow]);

  return null;
}
