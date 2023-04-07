import { Server } from "socket.io";

export default function SocketHandler(req, res) {
  if (res.socket.server.io) {
    console.log("Already set up");
  }else{
    const io = new Server(res.socket.server);
    res.socket.server.io = io;
    console.log("Setting up socket");
  }

  res.socket.server.io.on("connection", (socket) => {
    console.log(socket.id," user connected");
    socket.on("join_room",(data)=>{
      console.log(data);
    })
    socket.on("newuser",(user)=>{
      socket.broadcast.emit('update',user.fullName+" joined the group")
    })
   
  });
 

  
  res.end()
}