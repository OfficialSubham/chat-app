"use client";
import { useEffect, useState } from "react";
import { DefaultEventsMap } from "socket.io";
import { io, Socket } from "socket.io-client";

export default function Home() {
  const [socket, setSocket] = useState<Socket<DefaultEventsMap>>();

  const handleSocketConnection = () => {
    const s = io("http://localhost:9000", {
      transports: ["websocket"],
      autoConnect: false, //Keep the auto connect false cause if not it will create a new connection at first
    });
    //manually connect that
    s.connect();
    setSocket(s);
    s.on("connect", () => {
      console.log("connected to backend", s.id);
    });

    s.on("message", (msg) => {
      console.log("Recieved: ", msg);
    });
  };

  useEffect(() => {
    console.log(socket);
  }, [socket]);

  useEffect(() => {
    return () => {
      if (socket) socket.disconnect();
    };
  }, []);
  return (
    <div className="pt-10">
      Chat App
      <button
        className="bg-neutral-900 px-5 py-3 text-white rounded-md shadow-[0px_2px_4px_1px_rgba(255,255,255,0.5)_inset,0px_-2px_4px_1px_rgba(255,255,255,0.5)_inset,2px_0px_4px_1px_rgba(255,255,255,0.5)_inset]"
        onClick={handleSocketConnection}
      >
        Create connection
      </button>
    </div>
  );
}
