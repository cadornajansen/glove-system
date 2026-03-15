const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const WebSocket = require("ws");

const port = new SerialPort({
  path: "COM4",      // adjust if needed
  baudRate: 9600,
});

const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

const wss = new WebSocket.Server({ port: 3001 });

port.on("open", () => {
  console.log("Bluetooth connected on COM4");
});

port.on("error", (err) => {
  console.error("Serial error:", err.message);
});

parser.on("data", (line) => {
  line = line.trim();

  // Optional safety check
  if (!line.startsWith("{") || !line.endsWith("}")) return;
  console.log("Received:", line);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(line);
    }
  });
});

console.log("WebSocket running on ws://localhost:3001");