import React, { useEffect, useState } from "react";


function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async (e) => {
    e.preventDefault()
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
    
      console.log(messageData);
      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.off("receive_message").on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className='max-w-2xl m-auto '>
        <h2 className='bg-black text-white p-4 py-4 font-bold'>Chat Room</h2>
        <div className='bg-slate-200 h-screen relative overflow-y-scroll '>
        {messageList.map((data, index) => (
                <div className='message' key={index}>
                    {
                        
                        <div className={`w-full flex ${data.author===username?"justify-end":"justify-start"}`}>
                            <div className={`${data.type!=="update" && 'bg-white'} inline-block w-1/2 p-4 mt-5 mr-6 rounded-xl`}>
                                <p className='text-sm text-slate-300'>{data.author===username?"You":data.author}</p>
                                <p className='text-lg text-black'>{data.message}</p>
                                <p id="time">{data.time}</p>
                            </div>
                        </div>
                    }
                </div>
            ))}
         


        <form action="" className='flex w-full absolute bottom-0' onSubmit={sendMessage}>
            <input type="text" className='w-4/5 bg-slate-200 p-3 border border-gray-400' placeholder='New message' value={currentMessage} onChange={(e)=>{setCurrentMessage(event.target.value)}}/>
            <button type='submit' className='bg-green-700 w-1/5 text-white'>Send</button>
        </form>
        </div>
    

    </div>
 
  );
}

export default Chat;
