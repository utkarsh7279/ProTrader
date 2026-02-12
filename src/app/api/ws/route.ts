// WebSocket is handled by the FastAPI backend at ws://localhost:8001/ws
// This file is kept for reference only

export const dynamic = "force-dynamic";

export async function GET() {
  return new Response("WebSocket endpoint is running on FastAPI backend at port 8001", {
    status: 200,
  });
}