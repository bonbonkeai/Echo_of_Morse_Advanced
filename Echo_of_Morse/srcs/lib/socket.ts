import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket(token?: string) {
  if (typeof window === "undefined") return null;

  if (!socket) {
    const WS_URL = process.env.NEXT_PUBLIC_WS_URL || window.location.origin;
    socket = io(WS_URL, {
      path: "/socket.io/",
      transports: ["polling", "websocket"],
      autoConnect: false,
      auth: token ? { token } : undefined,
    });
    console.log("✅ SOCKET CREATED");
  }

  return socket;
}
