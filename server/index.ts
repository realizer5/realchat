const rooms = new Set<WebSocket>();
const server = Bun.serve({
  port: 8000,
  fetch(req, server) {
    const url = new URL(req.url);
    if (url.pathname === "/api/status/") {
      return new Response("server is running", { status: 200 });
    }
    return new Response("Not Found", { status: 404 });
  },
  websocket: {
    open(ws) {},
  },
});
