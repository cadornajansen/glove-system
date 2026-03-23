const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const WebSocket = require("ws");

const port = new SerialPort({
  path: "COM4",
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

  // basic validation
  if (!line.startsWith("{") || !line.endsWith("}")) return;

  let data;

  try {
    // 🛠 attempt to fix common corruption
    line = line
      .replace(/([a-zA-Z])"([a-zA-Z])/g, '$1","$2') // fix missing comma
      .replace(/"([a-zA-Z]+)"(?=[a-zA-Z])/g, '"$1":'); // fix missing colon

    data = JSON.parse(line);

  } catch (err) {
    console.warn("⚠ Skipping corrupted JSON:", line);
    return; // 🔥 IGNORE instead of crashing
  }

  // attach server timestamp
  data.serverTime = Date.now();

  const newLine = JSON.stringify(data);

  // broadcast safely
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(newLine);
    }
  });
});

console.log("WebSocket running on ws://localhost:3001");
