// 'use client';
// import { useState, useEffect } from 'react';
// import { io, Socket } from 'socket.io-client';
// import { useAuth } from '../context/AuthContext';
// import { useRouter } from 'next/navigation';

// interface MessageType {
//   user: string;
//   text: string;
// }

// let socket: Socket;

// export default function Chat() {
//   const { user } = useAuth();
//   const router = useRouter();
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState<MessageType[]>([]);

//   useEffect(() => {
//     if (!user) router.push('/');
//     socket = io('http://localhost:3000');

//     socket.on('receiveMessage', (msg: MessageType) => {
//       setMessages(prev => [...prev, msg]);
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, [user]);

//   const sendMessage = () => {
//     if (message.trim() !== '') {
//       const msgObj: MessageType = { user: user!.username, text: message };
//       socket.emit('sendMessage', msgObj);
//       setMessages(prev => [...prev, msgObj]);
//       setMessage('');
//     }
//   };

//   return (
//     <div style={{ padding: '20px' }}>
//       <h1>Chat App</h1>
//       <div style={{ border: '1px solid gray', height: '300px', overflowY: 'scroll', marginBottom: '10px', padding: '10px' }}>
//         {messages.map((m, i) => (
//           <div key={i}><strong>{m.user}:</strong> {m.text}</div>
//         ))}
//       </div>
//       <input
//         value={message}
//         onChange={e => setMessage(e.target.value)}
//         placeholder="Type a message"
//         style={{ padding: '10px', width: '70%' }}
//       />
//       <button onClick={sendMessage} style={{ padding: '10px' }}>Send</button>
//     </div>
//   );
// }



import React from "react";

const ChatPage = () => {
  return <div>Chat Page</div>;
};

export default ChatPage;
