import express from 'express';

import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { socketCommunication } from './controllers/sockets';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET'],
  },
});

const PORT = process.env.port || 3000;

app.use(express.json());

io.use((socket: Socket, next) => {
  socketCommunication(socket, io);
  next();
});

httpServer.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
