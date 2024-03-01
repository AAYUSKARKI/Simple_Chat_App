import  express  from "express";
import { Server } from "socket.io";
import path from 'path';
import { fileURLToPath } from 'url';
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server =app.listen(7000,()=>{
    console.log("server is running at port 7000")
})

const io = new Server(server);

let totalsocket= new Set()


io.on('connection',(socket)=>{
    socket.emit('A new user connected!')
    console.log('user connected',socket.id)
    totalsocket.add(socket.id)

    io.emit('totalclient',totalsocket.size)

    socket.on('disconnect',()=>{
        console.log('socket disconnected',socket.id)
        totalsocket.delete(socket.id)
        io.emit('totalclient',totalsocket.size)
    })
    socket.on('message',(data)=>{
        console.log(data)
        socket.broadcast.emit('chatmessage',data)
    })
socket.on('feedback',(data)=>{
    socket.broadcast.emit('feedback',data)
})

    })

app.use(express.static(path.join(__dirname,'public')))