import { io } from "socket.io-client";

const useSocket = () => {
  const token = localStorage.getItem("token");

  const socket = io("http://localhost:8000", {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return { socket };
};

export default useSocket;
