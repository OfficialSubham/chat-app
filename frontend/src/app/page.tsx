"use client";
import { useEffect, useRef, useState } from "react";
import { DefaultEventsMap } from "socket.io";
import { io, Socket } from "socket.io-client";

export default function Home() {
  // const [socket, setSocket] = useState<Socket<DefaultEventsMap> | null>(null);

  const socketRef = useRef<Socket<DefaultEventsMap> | null>(null);

  //React 18 hates any setState inside an effect so we will set it to ref

  // const handleSocketConnection = () => {
  //   const s = io("http://localhost:9000", {
  //     transports: ["websocket"],
  //     autoConnect: false, //Keep the auto connect false cause if not it will create a new connection at first
  //   });
  //   //manually connect that
  //   s.connect();
  //   setSocket(s);
  //   s.on("connect", () => {
  //     console.log("connected to backend", s.id);
  //   });

  //   s.on("message", (msg) => {
  //     console.log("Recieved: ", msg);
  //   });
  // };

  // useEffect(() => {
  //   console.log(socket);
  // }, [socket]);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<string[]>(["hello", "hi"]);

  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  };

  const handleSendMessage = () => {
    console.log(inputMessage);
    socketRef.current?.emit("user-message", inputMessage);
    setInputMessage("");
  };

  useEffect(() => {
    const s = io("http://localhost:9000", {
      transports: ["websocket"],
    });
    socketRef.current = s;
    console.log(s);
    s.on("connect", () => {
      console.log("connected to backend", s.id);
    });

    s.on("message", (msg) => {
      console.log("Recieved message : ", msg);
      setMessages((pre) => pre.concat(msg));
    });
  }, []);
  return (
    <div className="max-w-lg mx-auto">
      Chat App
      <div className="mb-10">
        <input
          type="text"
          className="outline-none bg-neutral-100 py-1 mr-2 rounded-md px-2 border border-neutral-200 placeholder:text-neutral-400 shadow-[0px_2px_4px_1px_rgba(0,0,0,0.1)_inset,0px_-2px_4px_1px_rgba(0,0,0,0.1)_inset]"
          placeholder="Enter message..."
          value={inputMessage}
          onChange={handleOnchange}
        />

        <button
          className="bg-neutral-900 px-3 py-1 text-white rounded-md shadow-[0px_2px_4px_1px_rgba(255,255,255,0.5)_inset,0px_-2px_4px_1px_rgba(255,255,255,0.5)_inset,2px_0px_4px_1px_rgba(255,255,255,0.5)_inset]"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
      <div className="overflow-y-scroll flex flex-col gap-2 bg-cyan-300 h-70 w-100">
        {messages?.map((text, idx) => {
          return (
            <p className="py-1 bg-neutral-500" key={idx}>
              {text}
            </p>
          );
        })}
      </div>
    </div>
  );
}
