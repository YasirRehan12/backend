// const express = require("express");
// const router = express.Router();
// const wrapAsync = require("../middlewares/wrapAsync");
// const { authorization } = require("../middlewares/authorization");
// const messageController = require("../controllers/message");

// router.post("/", authorization, wrapAsync(messageController.createMessage));
// router.get("/:chatId", authorization, wrapAsync(messageController.allMessage));
// router.get(
// 	"/clearChat/:chatId",
// 	authorization,
// 	wrapAsync(messageController.clearChat)
// );

// module.exports = router;

const express = require("express");
const router = express.Router();

const wrapAsync = require("../middlewares/wrapAsync");
const { authorization } = require("../middlewares/authorization");

const messageController = require("../controllers/message");

const upload = require("../config/multer");

// Send Message + Image
router.post(
	"/",
	authorization,
	upload.single("image"),
	wrapAsync(messageController.createMessage)
);

// Get All Messages
router.get(
	"/:chatId",
	authorization,
	wrapAsync(messageController.allMessage)
);

// Clear Chat
router.get(
	"/clearChat/:chatId",
	authorization,
	wrapAsync(messageController.clearChat)
);

module.exports = router;