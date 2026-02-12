let clients: any[] = [];

export function register(ws: any) {
  clients.push(ws);
}

export function broadcast(data: any) {
  clients.forEach(ws => ws.send(JSON.stringify(data)));
}
