
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

const corsOptions = {
    origin: "https://frontend-nine-theta-59.vercel.app",
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};

app.use(cors(corsOptions));
// app.options( cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

// All routers
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");
const messageRouter = require("./routes/message");


// Connect to Database
main()
    .then(() => console.log("Database Connection established"))
    .catch((err) => console.log(err));

let isConnected = false;

async function main() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        isConnected = true;
        console.log("Database Connection established");
    } catch (err) {
        console.log("Database Connection Failed! Retrying in 5 seconds...", err);
        setTimeout(main, 5000);
    }
}

// Root route
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to Chat Application!",
        frontend_url: process.env.FRONTEND_URL,
    });
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: "Invalid Route" });
});

// Error handler
app.use((err, req, res, next) => {
    const errorMessage = err.message || "Something Went Wrong!";
    res.status(500).json({ message: errorMessage });
});

// Start HTTP server
const server = app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

// Socket.IO setup (FIXED)
const { Server } = require("socket.io");

const io = new Server(server, {
    pingTimeout: 60000,
    transports: ["websocket"],
    cors: corsOptions,
});

// Socket connection
io.on("connection", (socket) => {
    console.log("Connected to socket.io:", socket.id);

    const setupHandler = (userId) => {
        if (!socket.hasJoined) {
            socket.join(userId);
            socket.hasJoined = true;
            socket.emit("connected");
        }
    };

    const newMessageHandler = (newMessageReceived) => {
        let chat = newMessageReceived?.chat;

        chat?.users?.forEach((user) => {
            if (user._id === newMessageReceived.sender._id) return;
            socket.in(user._id).emit("message received", newMessageReceived);
        });
    };

    const joinChatHandler = (room) => {
        if (socket.currentRoom && socket.currentRoom !== room) {
            socket.leave(socket.currentRoom);
        }
        socket.join(room);
        socket.currentRoom = room;
    };

    const typingHandler = (room) => {
        socket.in(room).emit("typing");
    };

    const stopTypingHandler = (room) => {
        socket.in(room).emit("stop typing");
    };

    const clearChatHandler = (chatId) => {
        socket.in(chatId).emit("clear chat", chatId);
    };

    const deleteChatHandler = (chat, authUserId) => {
        chat?.users?.forEach((user) => {
            if (authUserId === user._id) return;
            socket.in(user._id).emit("delete chat", chat._id);
        });
    };

    const chatCreateChatHandler = (chat, authUserId) => {
        chat?.users?.forEach((user) => {
            if (authUserId === user._id) return;
            socket.in(user._id).emit("chat created", chat);
        });
    };

    socket.on("setup", setupHandler);
    socket.on("new message", newMessageHandler);
    socket.on("join chat", joinChatHandler);
    socket.on("typing", typingHandler);
    socket.on("stop typing", stopTypingHandler);
    socket.on("clear chat", clearChatHandler);
    socket.on("delete chat", deleteChatHandler);
    socket.on("chat created", chatCreateChatHandler);
    socket.on("message seen", async ({ messageId, userId }) => {
        try {
            await Message.findByIdAndUpdate(messageId, {
                $addToSet: {
                    seenBy: userId,
                },
            });

            const updatedMessage = await Message.findById(messageId);

            socket.broadcast.emit("message seen", {
                messageId,
                userId,
                seenBy: updatedMessage.seenBy,
            });
        } catch (err) {
            console.log(err);
        }
    });

    socket.on("disconnect", () => {
        socket.off("setup", setupHandler);
        socket.off("new message", newMessageHandler);
        socket.off("join chat", joinChatHandler);
        socket.off("typing", typingHandler);
        socket.off("stop typing", stopTypingHandler);
        socket.off("clear chat", clearChatHandler);
        socket.off("delete chat", deleteChatHandler);
        socket.off("chat created", chatCreateChatHandler);
        
    });
});