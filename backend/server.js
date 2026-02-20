import express from "express"
import dotenv from "dotenv"
import http from "http"
import { errorHandler } from "./middlewares/errorHandler.js";
import ExpertRoutes from "./routes/ExpertRoutes.js";
import BookingRoutes from "./routes/BookingRoutes.js";
import { Server } from "socket.io";
import { ConnectDB } from "./config/db.js";
import cors from "cors"

dotenv.config()

ConnectDB();
const app = express();
app.use(cors());

app.use(express.json());
app.use("/experts",ExpertRoutes);
app.use("/bookings",BookingRoutes)
app.use(errorHandler);


const PORT=process.env.PORT || 7071


//Socket.io
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*"}})

io.on('connection', (socket) => {
    console.log('a user connected');
});

app.set('io', io);

server.listen(PORT,()=>
{
    console.log(`Server Listening on PORT ${PORT}`)
})