import express from 'express';

import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { socketCommunication, activeSockets } from './controllers/sockets';

const app = express();
const httpServer = createServer(app);

const cors = {
  origin: 'http://localhost:4200',
  methods: ['GET'],
};
const io = new Server(httpServer, {
  cors,
});

const PORT = process.env.port || 3000;

app.use(express.json());

io.use((socket: Socket, next) => {
  socketCommunication(socket, io);
  next();
});

app.get('/connections', (req, res) => {
  try {
    res.set('Access-Control-Allow-Origin', cors.origin);
    res.json({ connections: activeSockets.length });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

httpServer.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
