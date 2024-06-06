import express from "express";
import { Server } from "socket.io";
import __dirname from "./dirname.js";
import path from "path";

// creamos la app

const app = express();

// port

const PORT = 5000;

// app configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, "../public")));

const ServidorHttp = app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});

// configuracion socket.io
//  (seteamos el servidor)
const  io = new Server(ServidorHttp)   
const message = []


io.on('connection', (socket)=>{
    socket.on("inicio", (username) => {  
    console.log("Cliente conectad: " + username)

    // manejo de mensajes que se reciben 
    socket.on("message", (data)=>{
        message.push(data);

        // le envimaos el mensaje a los clientes conectados 
        io.emit("messages", message)
    })

    // manejos  de clientes a la hora de iniciar secion 

    socket.on("inicio",(data)=>{
        // le avisamos a los clientes conectados quien se conecto
        io.emit("inicio", data) 
        // el evento connected nos indica que ese cliente se conecto al chat 
        socket.broadcast.emit("connected", data);
    })

    // cuando se conecte cualquier cliente esto le llega al cliente conectado 
    socket.emit("message",message)


    socket.on("disconnect", ()=>{
        console.log("Cliente desconectado" , username);
    })
})
})

