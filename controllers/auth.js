const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../config/jwtProvider");

const registerUser = async (req, res, next) => {
	let { firstName, lastName, email, password } = req.body;
	const existingUser = await User.findOne({ email: email });
	if (existingUser) {
		return res.status(400).json({ message: `User Already Exist` });
	}
	password = bcrypt.hashSync(password, 8);
	const userData = new User({
		firstName,
		lastName,
		email,
		password,
	});
	const user = await userData.save();
	const jwt = generateToken(user._id);
	res.status(200).json({
		message: "Registration Successfully",
		token: jwt,
	});
};

const loginUser = async (req, res) => {
	let { email, password } = req.body;
	let user = await User.findOne({ email: email });
	if (!user) {
		return res.status(404).json({ message: `User Not Found` });
	}
	const isPasswordValid = bcrypt.compareSync(password, user.password);
	if (!isPasswordValid) {
		return res.status(401).json({ message: "Invalid Password" });
	}
	const jwt = generateToken(user._id);
	user.password = null;
	res.status(200).json({
		message: "Login Successfully",
		data: user,
		token: jwt,
	});
};
const updateProfileImage = async (req, res) => {
	try {
		const userId = req.body.userId;
		const file = req.file;

		if (!userId) {
			return res.status(400).json({
				message: "UserId is required",
			});
		}

		if (!file) {
			return res.status(400).json({
				message: "Image file is required",
			});
		}

		// Cloudinary URL
		const imageUrl = file.path;

		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{ image: imageUrl },
			{ new: true }
		);

		res.status(200).json({
			message: "Profile updated successfully",
			data: updatedUser,
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
};
module.exports = { registerUser, loginUser ,updateProfileImage};