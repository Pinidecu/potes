"use client";

import qz from "qz-tray";

export default function BotonImprimirPrueba() {
  async function handlePrint() {
    try {
      console.log("1. Inicio");

      if (!qz.websocket.isActive()) {
        console.log("2. Conectando a QZ...");
        await qz.websocket.connect();
        console.log("3. QZ conectado");
      } else {
        console.log("3. QZ ya estaba conectado");
      }

      const printerName = "POS-80";

      console.log("4. Buscando impresora...");
      const impresora = await qz.printers.find(printerName);
      console.log("5. Impresora encontrada:", impresora);

      const config = qz.configs.create(printerName, {
        encoding: "CP850",
      });

      const data = [
        "\x1B\x40",
        "PRUEBA DE IMPRESION\n",
        "Ensalada Cesar\n",
        "+ Pollo ------------26\n",
        "+ Queso\n",
        "\n\n\n",
      ];

      console.log("6. Enviando a imprimir...");
      await qz.print(config, data);
      console.log("7. Impresion enviada");

      alert("Impresión enviada");
    } catch (error) {
      console.error("ERROR COMPLETO:", error);
      alert("Error al imprimir. Mirá la consola del navegador.");
    }
  }

  return (
    <button
      onClick={handlePrint}
      className="rounded-md bg-black px-4 py-2 text-white"
    >
      Imprimir prueba
    </button>
  );
}
