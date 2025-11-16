interface WebsocketData {
  message: string;
  username: string;
  roomId: string;
}
const port = process.env.PORT || 8000;

const server = Bun.serve<WebsocketData>({
  port: port,
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
          username: "",
          message: `${ws.data.username} has entered the room`,
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
    close(ws) {
      const roomId = ws.data.roomId;
      ws.unsubscribe(roomId);
      server.publish(
        roomId,
        JSON.stringify({
          username: "",
          message: `${ws.data.username} left the room`,
        }),
      );
    },
  },
});

console.log(`✅ WebSocket server running on ${port}`);
