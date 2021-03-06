import express from 'express';
import path from 'path';

import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { socketCommunication, activeSockets } from './controllers/sockets';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer);

const PORT = process.env.PORT || 3000;

app.use(express.json());

io.use((socket: Socket, next) => {
  socketCommunication(socket, io);
  next();
});

app.get('/connections', (req, res) => {
  try {
    res.json({ connections: activeSockets.length });
  } catch (error) {
    res.status(500).send('Could not access live connections');
  }
});

app.get('*', (req, res) => {
  let file: string = req.path.slice(1);
  if (file === '') {
    file = 'index.html';
  }
  const filePath = process.env.NODE_ENV
    ? '../../trick-taking-simulator'
    : '../dist/trick-taking-simulator';
  res.sendFile(path.join(__dirname, `${filePath}/${file}`));
});

httpServer.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
