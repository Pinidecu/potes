"use client";

import qz from "qz-tray";

let connected = false;

async function ensureQZConnection() {
  if (!connected) {
    await qz.websocket.connect();
    connected = true;
  }
}

export async function printTestTicket() {
  await ensureQZConnection();

  const config = qz.configs.create("POS-80", {
    encoding: "CP850",
  });

  const data = [
    "\x1B\x40", // iniciar impresora
    "\x1B\x61\x01", // centrar
    "\x1B\x21\x08", // negrita
    "PRUEBA DE IMPRESION\n",
    "\x1B\x21\x00", // normal
    "-------------------------------\n",
    "\x1B\x61\x00", // izquierda
    "Ensalada Cesar\n",
    "+ Pollo\n",
    "+ Queso\n",
    "- Sin croutons\n",
    "Nota: sin sal\n",
    "\n",
    "Cliente: Juan Perez\n",
    "Hora: 13/03/2026 17:30\n",
    "-------------------------------\n",
    "\n\n\n",
    "\x1D\x56\x00", // corte
  ];

  await qz.print(config, data);
}
