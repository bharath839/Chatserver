const express=require('express');
const cors=require("cors");
const mongoose=require("mongoose");
const router = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const socket=require("socket.io");



const app=express();

require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use('/api',router);
app.use('/api/messages',messageRoutes);
mongoose.connect(process.env.MONGO_URL,{
   
}).then(()=>{
    console.log("db connection is successfull")
}).catch((error)=>{
    console.log(error);
})

const server =app.listen(process.env.PORT,()=>{
console.log(`server started on port ${process.env.PORT}`);
});



const io=socket(server,{
    cors: {
     origin:"http://localhost:3000",
     credentials :true  
    }
})
global.onlineUsers=new Map();

io.on("connection",(socket)=>{
global.chatSocket=socket;
socket.on("add-user",(userId)=>{
    onlineUsers.set(userId, socket.id);
});

socket.on("send-msg",(data)=>{
    const sendUserSocket=onlineUsers.get(data.to);
    if(sendUserSocket){
        socket.to(sendUserSocket).emit("msg-recieve",data.message);
    }
});
});