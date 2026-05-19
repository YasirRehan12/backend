// import GroupLogo from "../assets/group.png";
// // const getChatName = (chat, authUserId) => {
// // 	const chatName =
// // 		chat?.chatName == "Messenger"
// // 			? authUserId == chat.users[0]._id
// // 				? chat.users[1].firstName + " " + chat.users[1].lastName
// // 				: chat.users[0].firstName + " " + chat.users[0].lastName
// // 			: chat?.chatName;
// // 	return chatName;
// // };
// // export const getChatImage = (chat, authUserId) => {
// // 	const ImageLogo =
// // 		chat?.chatName == "Messenger"
// // 			? authUserId == chat.users[0]._id
// // 				? chat.users[1].image
// // 				: chat.users[0].image
// // 			: GroupLogo;
// // 	return ImageLogo;
// // };

// // export default getChatName;

// // import GroupLogo from "../assets/group.png";

import GroupLogo from "../assets/group.png";

const getChatName = (chat, authUserId) => {
	if (!chat?.users?.length) return "Chat";

	const myId = String(authUserId);

	const otherUser = chat.users.find(
		(u) => u && typeof u !== "string" && String(u._id) !== myId
	);

	if (chat?.isGroupChat) return chat.chatName;

	return (
		otherUser?.firstName +
			" " +
			otherUser?.lastName || "Unknown User"
	);
};

export const getChatImage = (chat, authUserId) => {
	// 1st priority: latest message image (you already have it)
	if (chat?.latestMessage?.image) {
		return chat.latestMessage.image;
	}

	// fallback: user image
	if (!chat?.users?.length) return GroupLogo;

	const myId = String(authUserId || "");

	const otherUser = chat.users.find(
		(u) => u && String(u._id) !== myId
	);

	console.log("Other User:", otherUser);
	return otherUser?.image || GroupLogo;
};

export default getChatName;