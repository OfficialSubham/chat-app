import http from "http";
import express from "express";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

//io will handle all the socket

//When the connection is on
//we will get the socket which is actually the details of client
//we can also call it client but in socket io world everone is socket
io.on("connection", (socket) => {
  console.log("A new user is connected", socket.id);
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
