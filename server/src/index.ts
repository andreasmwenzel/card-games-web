import { Server, Socket } from "socket.io";
import {createServer} from 'http';

const port:number = parseInt(process.env.PORT || '4000', 10);

const httpServer = createServer();
const io = new Server(httpServer, {
  // ...
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

let interval:NodeJS.Timeout;

io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

const getApiAndEmit = (socket:Socket) => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", response);
};

httpServer.listen(port, ()=>{
  console.log(`listening on port ${port}`)
});