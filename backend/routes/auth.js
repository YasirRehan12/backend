const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth");
const wrapAsync = require("../middlewares/wrapAsync");
const upload= require("../config/multer");

router.post("/signup", wrapAsync(authControllers.registerUser));
router.post("/signin", wrapAsync(authControllers.loginUser));
router.put(
	"/update-profile",
	upload.single("image"),
	wrapAsync(authControllers.updateProfileImage)
);

module.exports = router;