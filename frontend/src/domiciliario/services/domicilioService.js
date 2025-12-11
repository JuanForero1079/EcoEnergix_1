// src/domiciliario/services/domicilioService.js

let deliveries = [
  { id: 1, client: "Carlos Pérez", address: "Cra 45 #12-34", status: "Pendiente" },
  { id: 2, client: "Ana Torres", address: "Cll 90 #34-12", status: "Pendiente" },
  { id: 3, client: "Jorge Díaz", address: "Av. Siempre Viva 742", status: "En proceso" },
];

export function getDeliveries() {
  return deliveries;
}

export function updateDeliveryStatus(id, status) {
  deliveries = deliveries.map((d) =>
    d.id === id ? { ...d, status } : d
  );
}
