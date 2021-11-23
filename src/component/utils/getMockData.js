const mockInfo = {
  id: "CSL-1234567890",
  distance: "2km",
  price: 1000,
  driver: {
    photoUrl: "https://picsum.photos/200/300",
    name: "John Doe",
    phone: "+2349022233344",
  },
  locations: [
    { address: "14 Woji Road, GRA Phase 2", longitude: 1, latitude: 1 },
    { address: "25 Evo Road, GRA, Port Harcourt", longitude: 1, latitude: 1 },
  ],
  timestamp: new Date() - new Date(1000000),
  status: "delivered",
  note: "",
  mode: "Mini Van",
};

export function getMockInfo() {
  return mockInfo;
}

export function getMockHistory(length) {
  return new Array(length || 20).fill(mockInfo);
}
