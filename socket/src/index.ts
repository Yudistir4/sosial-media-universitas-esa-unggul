import { Server } from 'socket.io';
import dotenv from 'dotenv';
dotenv.config();

console.log();
interface Data {
  id: string;
  text: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  created_at: Date;
}
interface ServerToClientEvents {
  getUsers: (users: User[]) => void;
  receiveMessage: (data: Data) => void;
  receiveAsReadStatus: (data: {
    conversation_id: string;
    sender_id: string;
  }) => void;
}

interface ClientToServerEvents {
  addUser: (user_id: string) => void;
  sendMessage: (data: Data) => void;
  markAsRead: (data: { conversation_id: string; sender_id: string }) => void;
  // joinRoom: (roomId: string) => void;
  // leaveRoom: (roomId: string) =>  void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  name: string;
  age: number;
}
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>({
  cors: {
    origin: process.env.CLIENT_URL,
  },
});
interface User {
  user_id: string;
  socket_id: string;
}
let users: User[] = [];
const addUser = (user_id: string, socket_id: string) => {
  !users.some((user) => user.user_id === user_id) &&
    users.push({ user_id, socket_id });
};
const removeUser = (socket_id: string) => {
  users = users.filter((user) => user.socket_id !== socket_id);
};
const getUser = (user_id: string) => {
  return users.find((user) => user.user_id === user_id);
};

io.on('connection', (socket) => {
  console.log({ socket_id: socket.id });

  socket.on('addUser', (user_id) => {
    addUser(user_id, socket.id);
    io.emit('getUsers', users);
  });

  socket.on('sendMessage', (data) => {
    console.log({ message: data });
    const user = getUser(data.receiver_id);
    if (user) {
      io.to(user.socket_id).emit('receiveMessage', data);
    }
  });

  socket.on('markAsRead', (data) => {
    const user = getUser(data.sender_id);
    if (user) {
      io.to(user.socket_id).emit('receiveAsReadStatus', data);
    }
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected! : ', socket.id);
    removeUser(socket.id);
    io.emit('getUsers', users);
  });
});

io.listen(8000);
