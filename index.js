const { emit } = require("nodemon");
const { Socket } = require("socket.io");

const io = require("socket.io")(process.env.PORT, {
    cors: {
        origin: "http://localhost:3000",
    },
});

let users = [];

const sendUser = (userId, socketId) => {

    !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId })
}

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId)
}

const getUser = (userId) => {
    return users.find(user => user.userId === userId)
}





io.on("connection", (Socket) => {
    console.log("a user connected");


    // take userId and socketId from user

    Socket.on("sendUser", (userId) => {
        sendUser(userId, Socket.id);
        io.emit("getUsers", users)
    });

    // send message

    Socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        const user = getUser(receiverId)
        console.log(user);
        io.to(user.socketId).emit("getMessage", {
            senderId,
            text
        });
    });


    // disconect

    Socket.on("disconect", () => {
        console.log(("a user disconnected"));
        removeUser(Socket._id);
    })
    io.emit("getUsers", users)

});




