// const Chat = require("../models/chat");
// const Message = require("../models/message");

// const createMessage = async (req, res) => {
//     const { message, chatId } = req.body;
//     if (message) {
//         const newMessage = await Message.create({
//             sender: req.user._id,
//             message: message,
//             chat: chatId,
//         });
//         const chat = await Chat.findByIdAndUpdate(chatId, {
//             latestMessage: newMessage._id,
//         });
//         const fullMessage = await Message.findById(newMessage._id)
//             .populate("sender", "-password")
//             .populate({
//                 path: "chat",
//                 populate: { path: "users groupAdmin", select: "-password" },
//             });
//         return res.status(201).json({ data: fullMessage });
//     } else {
//         return res.status(400).json({ message: "Message not provide" });
//     }
// };

// const allMessage = async (req, res) => {
//     const chatId = req.params.chatId;
//     const messages = await Message.find({ chat: chatId })
//         .populate("sender", "-password")
//         .populate("chat");
//     return res.status(200).json({ data: messages });
// };
// const clearChat = async (req, res) => {
//     const chatId = req.params.chatId;
//     await Message.deleteMany({ chat: chatId });
//     return res.status(200).json({ message: "success" });
// };

// module.exports = { createMessage, allMessage, clearChat };
const Chat = require("../models/chat");
const Message = require("../models/message");

const createMessage = async (req, res) => {
	try {
		const { message, chatId } = req.body;

		// Image URL
		let image = "";

		if (req.file) {
			image = req.file.path;
		}

		// Message ya image me se aik hona zaruri
		if (!message && !image) {
			return res
				.status(400)
				.json({ message: "Message or image required" });
		}

		// Create Message
		const newMessage = await Message.create({
			sender: req.user._id,
			message: message || "",
			image,
			chat: chatId,
		});

		// Update latest message
		await Chat.findByIdAndUpdate(chatId, {
			latestMessage: newMessage._id,
		});

		// Populate
		const fullMessage = await Message.findById(newMessage._id)
			.populate("sender", "-password")
			.populate({
				path: "chat",
				populate: {
					path: "users groupAdmin",
					select: "-password",
				},
			});

		return res.status(201).json({
			success: true,
			data: fullMessage,
		});
	} catch (error) {
		console.log(error);

		return res.status(500).json({
			success: false,
			message: "Message send failed",
		});
	}
};

const allMessage = async (req, res) => {
	try {
		const chatId = req.params.chatId;

		const messages = await Message.find({
			chat: chatId,
		})
			.populate("sender", "-password")
			.populate("chat");

		return res.status(200).json({
			success: true,
			data: messages,
		});
	} catch (error) {
		console.log(error);

		return res.status(500).json({
			success: false,
			message: "Failed to fetch messages",
		});
	}
};

const clearChat = async (req, res) => {
	try {
		const chatId = req.params.chatId;

		await Message.deleteMany({
			chat: chatId,
		});

		return res.status(200).json({
			success: true,
			message: "Chat cleared",
		});
	} catch (error) {
		console.log(error);

		return res.status(500).json({
			success: false,
			message: "Failed to clear chat",
		});
	}
};

module.exports = {
	createMessage,
	allMessage,
	clearChat,
};