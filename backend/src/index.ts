import http from "http";
import express from "express";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000", "http://192.168.31.118:3000"],
    credentials: true,
  })
);
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://192.168.31.118:3000"],
    credentials: true,
  },
});

//io will handle all the socket

//When the connection is on
//we will get the socket which is actually the details of client
//we can also call it client but in socket io world everone is socket
io.on("connection", (socket) => {
  console.log("A new user is connected", socket.id);
  socket.on("user-message", (msg) => {
    //When socket sends a user message this runs
    console.log(msg);
    //As io is the websocket server it will broadcast it to everyone including the sender
    //socket.broadcast.emit send it to everyone except the sender
    // now we are emiting the message to the all person in the socket
    io.emit("message", msg);
  });

  //Handleing joing room
  socket.on("join-room", ({ roomId, username }) => {
    console.log(roomId);
    socket.join(roomId);
    socket.to(roomId).emit("join-room", username);
  });

  //Handleing sending message
  socket.on("send-message", ({ roomId, msg, username }) => {
    console.log(roomId, msg, username);
    io.to(roomId).emit("text-message", { username, msg, system: false });
  });

  //handling left chat
  socket.on("left-room", ({ roomId, username }) => {
    socket.leave(roomId);
    socket.to(roomId).emit("user-left", username);
  });

  // When socket is on but user got or disconnect this runs
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

//Express will handle all the http

app.get("/", (req, res) => {
  console.log("Hello world");
  res.json({ message: "working fine" });
});

/*
If i do app.listen directly then i will not able to access
the server which is required to make websockets
so importing http is important
*/

server.listen(9000, () => {
  console.log("Your server had started");
});
