import { createServer } from 'http';
import { setupWebSocketServer } from './ws-inboxtab.js';
import { createApp } from 'h3';

// Create your H3 server
const server = createServer(createApp());

// Set up WebSocket server
setupWebSocketServer(server);

// Start the server
const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
