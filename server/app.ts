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
const sockets = []
io.on('connection', (socket: Socket) => {
  // console.log("CONNECTED", socket)
  sockets.push(socket)
  console.log(sockets.length)
  socket.on('message', (data) => {
    console.log("MESAGE recieved", data)
    io.emit("broadcast_message", `${data} modified from BE`)

  })
})



httpServer.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
