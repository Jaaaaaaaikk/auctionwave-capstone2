import { WebSocketServer } from 'ws';

export const wss = new WebSocketServer({ noServer: true });
const clients = new Set();

export const setupWebSocketServer = (server) => {
    server.on('upgrade', (request, socket, head) => {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    });

    wss.on('connection', (ws) => {
        console.log('Client connected');
        clients.add(ws); // Store the new client

        ws.on('message', (message) => {
            console.log(`Received message: ${message}`);
        });

        ws.on('close', () => {
            console.log('Client disconnected');
            clients.delete(ws); // Remove disconnected client
        });

        ws.on('error', (error) => {
            console.error('WebSocket error observed:', error);
        });
    });
};
