
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
			seenBy: [req.user._id],
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


const markSeen = async (req, res) => {
	try {
		const { messageId } = req.body;

		const updatedMessage = await Message.findByIdAndUpdate(
			messageId,
			{
				$addToSet: {
					seenBy: req.user._id,
				},
			},
			{ new: true }
		)
			.populate("seenBy", "-password")
			.populate("sender", "-password");

		return res.status(200).json({ success: true });
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to mark seen",
		});
	}
};

module.exports = {
	createMessage,
	allMessage,
	clearChat,
	markSeen,
};