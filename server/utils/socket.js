let io = null;

const initSocket = (httpServer) => {
    const { Server } = require("socket.io");
    io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:5173",
            credentials: true,
        },
    });
    return io;
};

// Broadcast that the product catalog changed so all connected clients refresh
const emitProductsChanged = () => {
    if (io) {
        io.emit("products:changed");
    }
};

module.exports = { initSocket, emitProductsChanged };
