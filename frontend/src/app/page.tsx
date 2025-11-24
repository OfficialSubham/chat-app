"use client";
import { useEffect, useRef, useState } from "react";
import { DefaultEventsMap } from "socket.io";
import { io, Socket } from "socket.io-client";

type MessageType = {
  userId: string;
  message: string;
};

export default function Home() {
  const [socket, setSocket] = useState<Socket<DefaultEventsMap> | null>(null);

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
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputRoomId, setInputRoomId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");

  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  };
  const handleRoomId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputRoomId(e.target.value);
  };
  const handleJoinRoom = () => {
    if (!socket) return;
    //Now giving the current input room id
    //Cause i actually forget about the usestate didnot set the value
    //instantly
    setRoomId(inputRoomId);
    socket.emit("join-room", inputRoomId);
  };
  const handleSendMessage = () => {
    //If the user is not connected with room no message
    if (!inputMessage || !socket || roomId) return;
    socket.emit("send-message", {
      roomId,
      msg: inputMessage,
      userId: currentUserId,
    });
    setInputMessage("");
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("text-message", ({ userId, msg }) => {
      console.log("Recieved message : ", msg);
      console.log(userId);
      setMessages((pre) => pre.concat({ userId, message: msg }));
    });

    return () => {};
  }, [socket]);

  useEffect(() => {
    const s = io("http://localhost:9000", {
      transports: ["websocket"],
    });
    socketRef.current = s;
    console.log(s);
    s.on("connect", () => {
      console.log("connected to backend", s.id);
      setCurrentUserId(s.id || "");
      setSocket(s);
    });
    return () => {
      s.disconnect();
    };
  }, []);
  return (
    <div className="max-w-md mx-auto">
      <h1 className="font-bold  mx-auto text-center italic text-2xl">
        Chat App
      </h1>
      <div>
        {roomId ? (
          <div className="px-5 py-1 bg-neutral-100  w-fit rounded-md shadow-sm inset-shadow-sm mb-3">
            {roomId}
          </div>
        ) : (
          <div>
            <input
              type="text"
              className="outline-none mb-3 bg-neutral-100 py-1 mr-2 rounded-md px-2 border border-neutral-200 placeholder:text-neutral-400 "
              placeholder="Enter RoomId"
              value={inputRoomId}
              onChange={handleRoomId}
            />
            <button
              className="bg-neutral-900 px-3 py-1 text-white rounded-md shadow-[0px_2px_4px_1px_rgba(255,255,255,0.5)_inset,0px_-2px_4px_1px_rgba(255,255,255,0.5)_inset,2px_0px_4px_1px_rgba(255,255,255,0.5)_inset]"
              onClick={handleJoinRoom}
            >
              Join
            </button>
          </div>
        )}
      </div>
      <div className="mb-10">
        <input
          type="text"
          className="outline-none bg-neutral-100 py-1 mr-2 rounded-md px-2 border border-neutral-200 placeholder:text-neutral-400 "
          placeholder="Enter message..."
          value={inputMessage}
          onChange={handleOnchange}
          onKeyDown={(e) => e.key == "Enter" && handleSendMessage()}
        />

        <button
          className="bg-neutral-900 px-3 py-1 text-white rounded-md shadow-[0px_2px_4px_1px_rgba(255,255,255,0.5)_inset,0px_-2px_4px_1px_rgba(255,255,255,0.5)_inset,2px_0px_4px_1px_rgba(255,255,255,0.5)_inset]"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
      <div className="overflow-y-scroll flex flex-col gap-2 bg-neutral-100 rounded-md shadow  h-70 w-100 no-scrollbar-arrows p-2">
        {messages?.map(({ userId, message }, idx) => {
          return userId == currentUserId ? (
            <div key={idx} className="flex justify-end">
              <p className="py-1 bg-green-300 w-fit px-1 rounded-l-lg rounded-tr-2xl relative">
                {message}
              </p>
            </div>
          ) : (
            <div key={idx} className="">
              <p className="py-1 bg-cyan-300 w-fit px-1 rounded-r-lg rounded-tl-2xl">
                {message}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
