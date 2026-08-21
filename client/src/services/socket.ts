import { io } from "socket.io-client";

// Connects to the backend through the Vite proxy (same origin in production)
const socket = io({
    transports: ["websocket", "polling"],
});

export default socket;
