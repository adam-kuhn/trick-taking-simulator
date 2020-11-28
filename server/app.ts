import express from 'express';

import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

import routes from './routes';

const app = express();
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET"]
  }
})

const PORT = process.env.port || 3000;

app.use(express.json());

app.use('/api', routes);

let activeSockets: Socket[] = []
io.on('connection', (socket: Socket) => {
  activeSockets.push(socket)
  socket.on('message', (data) => {
    console.log("MESAGE recieved", data)
    io.emit("broadcast_message", `${data} modified from BE`)
  })
  socket.on('disconnect', (reason) => {
    activeSockets = activeSockets.filter(activeSocket => activeSocket.id !== socket.id)
   })
})



httpServer.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
