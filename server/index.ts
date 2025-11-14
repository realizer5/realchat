interface WebsocketData {
  message: string;
  username: string;
  roomId: string;
}

const rooms = new Set<string>();

const server = Bun.serve<WebsocketData>({
  port: 8000,
  fetch(req, server) {
    const url = new URL(req.url);
    if (url.pathname === "/api/status/") {
      return new Response("server is running", { status: 200 });
    }
    if (url.pathname === "/room") {
      const success = server.upgrade(req, {
        data: {
          roomId: url.searchParams.get("roomId"),
          username: url.searchParams.get("username"),
        } as WebsocketData,
      });
      return success
        ? undefined
        : new Response("WebSocket upgrade failed", { status: 400 });
    }

    return new Response("Not Found", { status: 404 });
  },
  websocket: {
    open(ws) {
      const roomId = ws.data.roomId;
      ws.subscribe(roomId);
      server.publish(
        roomId,
        JSON.stringify({
          username: "system",
          message: `${ws.data.username} has entered the chat`,
        }),
      );
    },

    message(ws, message) {
      server.publish(
        ws.data.roomId,
        JSON.stringify({
          username: ws.data.username,
          message: message,
        }),
      );
    },
    close(ws) {},
  },
});

console.log(`✅ WebSocket server running on ws://localhost:8000/room`);
