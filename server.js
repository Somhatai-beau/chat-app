const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");

const {
  userJoin,
  getCurrentUser,
  userLeave,
  getUsers,
  switchRoom
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// === Set static folder === 
app.use(express.static(path.join(__dirname, "public")));

const botName = "ChatBot";

// === Run when client connects === 
io.on("connection", (socket) => {
  //console.log(io.of("/").adapter);
  socket.on("joinRoom", ({ username, room, type}) => {
    console.log('joinRoom <- username:', username, ", room:", room, ", type:", type)
    const user = userJoin(socket.id, username, room, type);

    socket.join(user.room);

    // === Welcome current user === 
    socket.emit("message", formatMessage(botName, "Welcome to Live Chat"));

    // === Send FAQ === 
    if(user.type!='admin'){
      socket.emit("messageFAQ", formatMessage(botName, "FAQ"));
    }

    // === Broadcast when a user connects ===
    socket.broadcast
      .to('admin')
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
    );

    // === Send users and room info === 
    io.to('admin').emit("Users", {
      users: getUsers(),
    });
  });

  socket.on("faq", (faq) => {
    console.log('faq from:', faq)
    //if( faq.username!='admin'){
    const qid = faq.qid;
    socket.emit('messageAns', formatMessage(botName, qid.toString()));
    //}
  });

  // === Admin Join a User ===
  socket.on("joinUser", ({ username, userroom}) => {
    console.log(username +' join '+ userroom);
    socket.join(userroom);

    switchRoom(username, userroom);

    socket.emit("message", formatMessage(botName, username + " have joined " + userroom));

    socket.broadcast
      .to(userroom)
      .emit(
        "message",
        formatMessage(botName, `${username} has joined the chat`)
    );

  });

  // === Listen for chatMessage === 
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  // === Runs when client disconnects === 
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to('admin').emit("Users", {
        users: getUsers(),
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
