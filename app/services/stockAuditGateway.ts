import { GetNodesResponse } from "./stockAuditService";

export const fetchStockAuditData = async (containerLabel: string) => {
  try {
    // todo - replace static container label with dynamic value
    const response = await fetch(
      `http://localhost:3000/stock/audit?container_label=${containerLabel}`,
      {
        method: "GET",
      }
    );

    return (await response.json()) as GetNodesResponse;
  } catch (error) {
    // todo - add toast notification
    console.log("Error Calling API");
  }
};

export const getStubbedNodes = (): GetNodesResponse => {
  return {
    containerId: 123,
    containerLabel: "CAS2414",
    events: [
      {
        id: 1,
        fromLocation: null,
        toLocation: null,
        type: "delivery",
        quantity: 23234,
        user: "Jake Maguire",
        eventTime: "2023-10-01 10:10:00",
        createdAt: "2023-10-01 10:10:00",
      },
      {
        id: 2,
        fromLocation: null,
        toLocation: {
          locationId: 2,
          locationName: "A047",
          hub: 3024,
          siteId: 1,
          siteName: "CH001 (Chippenham, UK)",
        },
        type: "goodsIn",
        quantity: 23234,
        user: "Jake Maguire",
        eventTime: "2023-10-01 10:10:00",
        createdAt: "2023-10-01 10:10:00",
      },
      {
        id: 3,
        fromLocation: {
          locationId: 2,
          locationName: "A047",
          hub: 3024,
          siteId: 1,
          siteName: "CH001 (Chippenham, UK)",
        },
        toLocation: {
          locationId: 3,
          locationName: "B389",
          hub: 4023,
          siteId: 1,
          siteName: "CH001 (Chippenham, UK)",
        },
        type: "move",
        quantity: 23234,
        user: "Jake Maguire",
        eventTime: "2023-10-01 10:10:00",
        createdAt: "2023-10-01 10:10:00",
      },
      {
        id: 4,
        fromLocation: {
          locationId: 3,
          locationName: "B389",
          hub: 4023,
          siteId: 1,
          siteName: "CH001 (Chippenham, UK)",
        },
        toLocation: {
          locationId: 4,
          locationName: "B345",
          hub: 4023,
          siteId: 1,
          siteName: "CH001 (Chippenham, UK)",
        },
        type: "palletMove",
        quantity: 23234,
        user: "Jake Maguire",
        eventTime: "2023-10-01 10:10:00",
        createdAt: "2023-10-01 10:10:00",
      },
      {
        id: 5,
        fromLocation: {
          locationId: 4,
          locationName: "B389",
          hub: 4023,
          siteId: 1,
          siteName: "CH001 (Chippenham, UK)",
        },
        toLocation: {
          locationId: 5,
          locationName: "B345",
          hub: 4023,
          siteId: 1,
          siteName: "CH001 (Chippenham, UK)",
        },
        type: "transit",
        quantity: 23234,
        user: "Jake Maguire",
        eventTime: "2023-10-01 10:10:00",
        createdAt: "2023-10-01 10:10:00",
      },
      {
        id: 6,
        fromLocation: {
          locationId: 5,
          locationName: "B389",
          hub: 4023,
          siteId: 1,
          siteName: "CH001 (Chippenham, UK)",
        },
        toLocation: {
          locationId: 6,
          locationName: "L382",
          hub: 8923,
          siteId: 2,
          siteName: "MA001 (Madrid, ES)",
        },
        type: "move",
        quantity: 23234,
        user: "Jake Maguire",
        eventTime: "2023-10-01 10:10:00",
        createdAt: "2023-10-01 10:10:00",
      },
      {
        id: 7,
        fromLocation: {
          locationId: 6,
          locationName: "L382",
          hub: 8923,
          siteId: 2,
          siteName: "MA001 (Madrid, ES)",
        },
        toLocation: {
          locationId: 7,
          locationName: "M934",
          hub: 4535,
          siteId: 2,
          siteName: "MA001 (Madrid, ES)",
        },
        type: "move",
        quantity: 23234,
        user: "Jake Maguire",
        eventTime: "2023-10-01 10:10:00",
        createdAt: "2023-10-01 10:10:00",
      },
      {
        id: 8,
        fromLocation: {
          locationId: 8,
          locationName: "M934",
          hub: 4535,
          siteId: 2,
          siteName: "MA001 (Madrid, ES)",
        },
        toLocation: {
          locationId: 9,
          locationName: "H734 - Shelf",
          hub: 4535,
          siteId: 3,
          siteName: "JAKELAND",
        },
        type: "bookIn",
        quantity: 23234,
        user: "Jake Maguire",
        eventTime: "2023-10-01 10:10:00",
        createdAt: "2023-10-01 10:10:00",
      },
    ],
  };
};
