"use client";

import qz from "qz-tray";

type CartItem = {
  salad: any;
  quantity: number;
  extra: string[];
  removedIngredients?: string;
  price?: number;
};

type Customer = {
  name?: string;
  address?: string;
};

type Order = {
  _id: string;
  customer?: Customer;
  cart: CartItem[];
  totalPrice: number;
  createdAt?: string;
};

let connected = false;

async function ensureQZConnection() {
  if (!connected) {
    await qz.websocket.connect();
    connected = true;
  }
}

function money(value: number) {
  return `$${value.toFixed(2)}`;
}

function formatNow() {
  const now = new Date();
  return now.toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export async function printOrderTicket(
  order: Order,
  getSaladName: (salad: any) => string,
  getIngredientNames: (extras: string[]) => string
) {
  await ensureQZConnection();

  const config = qz.configs.create("POS-80", {
    encoding: "CP850",
  });

  const data: string[] = [];

  data.push("\x1B\x40"); // init
  data.push("\x1B\x61\x01"); // center
  data.push("\x1B\x21\x20"); // doble alto
  data.push("POTE\n");
  data.push("\x1B\x21\x08"); // bold
  data.push("NO VALIDO COMO FACTURA\n");
  data.push("\x1B\x21\x00"); // normal
  data.push("\n");

  data.push("\x1B\x61\x00"); // left
  data.push(`Fecha: ${formatNow()}\n`);
  data.push(`Cliente: ${order.customer?.name ?? "Sin nombre"}\n`);
  data.push(`Direccion: ${order.customer?.address ?? "Sin direccion"}\n`);
  data.push("--------------------------------\n");

  order.cart.forEach((item) => {
    const saladName = getSaladName(item.salad);

    data.push("\x1B\x21\x08"); // bold
    data.push(`${saladName} x${item.quantity}\n`);
    data.push("\x1B\x21\x00"); // normal

    if (item.extra && item.extra.length > 0) {
      data.push(`Agregados: ${getIngredientNames(item.extra)}\n`);
    }

    if (item.removedIngredients?.trim()) {
      data.push(`Quitar: ${item.removedIngredients}\n`);
    }

    if (typeof item.price === "number") {
      data.push(`Precio: ${money(item.price)}\n`);
    }

    data.push("\n");
  });

  data.push("--------------------------------\n");
  data.push("\x1B\x21\x08"); // bold
  data.push(`Total: ${money(order.totalPrice)}\n`);
  data.push("\x1B\x21\x00");
  data.push("\n\n\n");
  data.push("\x1D\x56\x00"); // cut

  await qz.print(config, data);
}
