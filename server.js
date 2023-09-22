const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const { WebcastPushConnection } = require("tiktok-live-connector");

const app = express();
app.use(express.static("public"));
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const port = 3000;

// Define your characters and their initial health
let ronaldoHealth = 100;
let messiHealth = 100;

// Create a new wrapper object and pass the TikTok username of the streamer
const tiktokUsername = "perfectbalance19891";
const tiktokLiveConnection = new WebcastPushConnection(tiktokUsername);

// Connect to the TikTok live stream
tiktokLiveConnection
  .connect()
  .then((state) => {
    console.info(`Connected to roomId ${state.roomId}`);
  })
  .catch((err) => {
    console.error("Failed to connect", err);
  });

tiktokLiveConnection.on("gift", (data) => {
  if (data.giftType === 1 && !data.repeatEnd) {
    // Streak in progress => show only temporary
    console.log(
      `${data.uniqueId} is sending gift ${data.giftName} x${data.repeatCount}`
    );
  } else {
    // Streak ended or non-streakable gift => process the gift with final repeat_count
    console.log(
      `${data.uniqueId} has sent gift ${data.giftName} x${data.repeatCount} + ${data.giftId}`
    );

    if (data.giftId === 5655) {
      // Logic for gift ID 5655
      messiHealth += 1 * data.repeatCount;
      console.log(`Handling gift ID 5655`);
    } else if (data.giftId === 6652) {
      // Logic for gift ID 6652
      // Modify health values as needed
      messiHealth -= 1 * data.repeatCount;
      console.log(`Handling gift ID 6652`);
    } else if (data.giftId === 8815) {
      // Logic for gift ID 8815
      // Modify health values as needed
      messiHealth += 5 * data.repeatCount;
      console.log(`Handling gift ID 8815`);
    } else if (data.giftId === 8963) {
      // Logic for gift ID 8963
      // Modify health values as needed
      messiHealth -= 5 * data.repeatCount;
      console.log(`Handling gift ID 8963`);
    } else if (data.giftId === 8870) {
      // Logic for gift ID 8870
      // Modify health values as needed
      console.log(`Handling gift ID 8870`);
      messiHealth += 10 * data.repeatCount;
    } else if (data.giftId === 5658) {
      console.log(`Handling gift ID 5658`);
      messiHealth += 20 * data.repeatCount;
    } else if (data.giftId === 5760) {
      // Logic for gift ID 5760
      // Modify health values as needed
      ronaldoHealth += 1 * data.repeatCount;
      console.log(`Handling gift ID 5760`);
    } else if (data.giftId === 6064) {
      // Logic for gift ID 6064
      // Modify health values as needed
      ronaldoHealth -= 1 * data.repeatCount;
      console.log(`Handling gift ID 6064`);
    } else if (data.giftId === 8768) {
      // Logic for gift ID 8768
      // Modify health values as needed
      ronaldoHealth += 5 * data.repeatCount;
      console.log(`Handling gift ID 8768`);
    } else if (data.giftId === 5487) {
      // Logic for gift ID 5487
      // Modify health values as needed
      console.log(`Handling gift ID 5487`);
      ronaldoHealth -= 5 * data.repeatCount;
    } else if (data.giftId === 7591) {
      console.log(`Handling gift ID 7591`);
      ronaldoHealth += 10 * data.repeatCount;
    } else if (data.giftId === 8552) {
      console.log(`Handling gift ID 8552`);
      ronaldoHealth += 20 * data.repeatCount;
    }

    // Send health updates to connected clients (frontend) for all gift IDs
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({ type: "healthUpdate", ronaldoHealth, messiHealth })
        );
      }
      console.log(`Ronaldo Health: ${ronaldoHealth}`);
      console.log(`Messi Health: ${messiHealth}`);
    });
  }
});

// Serve the HTML file
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// WebSocket connection handling
wss.on("connection", (ws) => {
  console.log("Client connected");

  // Send initial health values for both Ronaldo and Messi to the client
  ws.send(JSON.stringify({ type: "healthUpdate", ronaldoHealth, messiHealth }));

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

// Serve your frontend files (CSS, JavaScript, etc.)
app.use(express.static("../frontend"));

// Start the server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
