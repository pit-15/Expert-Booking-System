import express from "express"
import dotenv from "dotenv"
import http from "http"
import { errorHandler } from "./middlewares/errorHandler.js";
import { Server } from "socket.io";
import { ConnectDB } from "./config/db.js";


dotenv.config()

ConnectDB();
const app = express();

app.use(express.json())
app.use(errorHandler)

const PORT=process.env.PORT || 7071


//Socket.io
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*"}})

io.on('connection', (socket) => {
    console.log('a user connected');
});

app.set('io', io);

app.listen(PORT,()=>
{
    console.log(`Server Listening on PORT${PORT}`)
})