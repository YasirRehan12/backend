

// import React, { useState, useEffect } from "react";

// import { MdOutlineClose } from "react-icons/md";
// import { useDispatch, useSelector } from "react-redux";
// import { setProfileDetail } from "../redux/slices/conditionSlice";
// import { toast } from "react-toastify";

// const ProfileDetail = () => {
// 	const dispatch = useDispatch();
// 	const user = useSelector((store) => store.auth);

// 	const [imageFile, setImageFile] = useState(null);
// 	const [preview, setPreview] = useState(user?.image || "");
// 	const [loading, setLoading] = useState(false);

// 	// update preview if user changes
// 	useEffect(() => {
// 		setPreview(user?.image);
// 	}, [user]);

// 	const handleImageChange = (e) => {
// 		const file = e.target.files[0];
// 		if (!file) return;

// 		setImageFile(file);
// 		setPreview(URL.createObjectURL(file));
// 	};

// 	const handleUpdate = async () => {
// 		try {
// 			if (!imageFile) {
// 				return toast.error("Please select an image");
// 			}

// 			setLoading(true);

// 			const formData = new FormData();
// 			formData.append("userId", user._id);
// 			formData.append("image", imageFile);

// 			const response = await fetch(
// 				`${import.meta.env.VITE_BACKEND_URL}/api/auth/update-profile`,
// 				{
// 					method: "PUT",
// 					body: formData,
// 				}
// 			);

// 			const json = await response.json();

// 			if (response.ok) {
// 				toast.success(json.message || "Profile updated");
// 				window.location.reload();
// 			} else {
// 				toast.error(json.message || "Update failed");
// 			}
// 		} catch (error) {
// 			console.log(error);
// 			toast.error(error.message);
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	const handleLogout = () => {
// 		localStorage.removeItem("token");
// 		window.location.reload();
// 	};

// 	return (
// 		<div className="flex -m-2 sm:-m-4 flex-col items-center my-6 text-slate-300 min-h-screen w-full fixed top-0 justify-center z-50 bg-black/40 px-2">
// 			<div className="p-4 pt-5 w-full sm:w-[60%] md:w-[50%] lg:w-[40%] min-w-72 max-w-[500px] border border-slate-400 bg-slate-800 rounded-lg h-fit mt-5 relative">

// 				<h2 className="text-2xl underline underline-offset-8 font-semibold text-slate-100 w-full text-center mb-5">
// 					Profile
// 				</h2>

// 				<div className="flex flex-col items-center gap-4">

// 					{/* IMAGE PREVIEW */}
// 					<img
// 						src={
// 							preview ||
// 							"https://cdn-icons-png.flaticon.com/512/149/149071.png"
// 						}
// 						alt="profile"
// 						className="w-24 h-24 rounded-full object-cover border-2 border-slate-400"
// 					/>

// 					{/* FILE INPUT */}
// 					<input
// 						type="file"
// 						accept="image/*"
// 						onChange={handleImageChange}
// 						className="w-full bg-white text-black p-2 rounded-md"
// 					/>

// 					{/* UPDATE BUTTON */}
// 					<button
// 						onClick={handleUpdate}
// 						disabled={loading}
// 						className="bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-bold py-2 px-4 rounded w-full"
// 					>
// 						{loading ? "Updating..." : "Update Profile"}
// 					</button>

// 					{/* USER INFO */}
// 					<div className="w-full border-t border-slate-600 pt-4">
// 						<h3 className="text-lg font-semibold">
// 							Name: {user.firstName} {user.lastName}
// 						</h3>

// 						<h3 className="text-lg font-semibold break-all">
// 							Email: {user.email}
// 						</h3>

// 						<button
// 							onClick={handleLogout}
// 							className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 w-full"
// 						>
// 							Logout
// 						</button>
// 					</div>
// 				</div>

// 				{/* CLOSE BUTTON */}
// 				<div
// 					onClick={() => dispatch(setProfileDetail())}
// 					className="absolute top-3 right-3 bg-black/20 hover:bg-black/50 h-8 w-8 flex items-center justify-center rounded-md cursor-pointer"
// 				>
// 					<MdOutlineClose size={22} />
// 				</div>

// 			</div>
// 		</div>
// 	);
// };

// export default ProfileDetail;


import React, { useState, useEffect } from "react";
import { MdOutlineClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setProfileDetail } from "../redux/slices/conditionSlice";
import { toast } from "react-toastify";

const ProfileDetail = () => {
	const dispatch = useDispatch();
	const user = useSelector((store) => store.auth);

	const [imageFile, setImageFile] = useState(null);
	const [preview, setPreview] = useState("");
	const [loading, setLoading] = useState(false);

	// set initial image
	useEffect(() => {
		setPreview(user?.image || "");
	}, [user]);

	// cleanup object URL (memory fix)
	useEffect(() => {
		return () => {
			if (preview && preview.startsWith("blob:")) {
				URL.revokeObjectURL(preview);
			}
		};
	}, [preview]);

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (!file) return;

		// validation
		if (!file.type.startsWith("image/")) {
			return toast.error("Please select a valid image file");
		}

		setImageFile(file);

		// preview
		const tempUrl = URL.createObjectURL(file);
		setPreview(tempUrl);
	};

	const handleUpdate = async () => {
		try {
			if (!imageFile) {
				return toast.error("Please select an image first");
			}

			setLoading(true);

			const formData = new FormData();
			formData.append("userId", user._id);
			formData.append("image", imageFile);

			const response = await fetch(
				`${import.meta.env.VITE_BACKEND_URL}/api/auth/update-profile`,
				{
					method: "PUT",
					body: formData,
				}
			);

			const json = await response.json();

			if (response.ok) {
				toast.success(json.message || "Profile updated successfully");
				window.location.reload();
			} else {
				toast.error(json.message || "Update failed");
			}
		} catch (error) {
			console.log(error);
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	const handleLogout = () => {
		localStorage.removeItem("token");
		window.location.reload();
	};

	return (
		<div className="flex -m-2 sm:-m-4 flex-col items-center my-6 text-slate-300 min-h-screen w-full fixed top-0 justify-center z-50 bg-black/40 px-2">

			<div className="p-4 pt-5 w-full sm:w-[60%] md:w-[50%] lg:w-[40%] min-w-72 max-w-[500px] border border-slate-400 bg-slate-800 rounded-lg relative">

				<h2 className="text-2xl underline underline-offset-8 font-semibold text-slate-100 text-center mb-5">
					Profile
				</h2>

				<div className="flex flex-col items-center gap-4">

					{/* IMAGE */}
					<img
						src={
							preview ||
							"https://cdn-icons-png.flaticon.com/512/149/149071.png"
						}
						alt="profile"
						className="w-24 h-24 rounded-full object-cover border-2 border-slate-400"
					/>

					{/* FILE INPUT */}
					<input
						type="file"
						accept="image/*"
						onChange={handleImageChange}
						className="w-full bg-white text-black p-2 rounded-md"
					/>

					{/* UPDATE BUTTON */}
					<button
						onClick={handleUpdate}
						disabled={loading}
						className="bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-bold py-2 px-4 rounded w-full"
					>
						{loading ? "Updating..." : "Update Profile"}
					</button>

					{/* USER INFO */}
					<div className="w-full border-t border-slate-600 pt-4">
						<h3 className="text-lg font-semibold">
							Name: {user?.firstName} {user?.lastName}
						</h3>

						<h3 className="text-lg font-semibold break-all">
							Email: {user?.email}
						</h3>

						<button
							onClick={handleLogout}
							className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 w-full"
						>
							Logout
						</button>
					</div>
				</div>

				{/* CLOSE */}
				<div
					onClick={() => dispatch(setProfileDetail())}
					className="absolute top-3 right-3 bg-black/20 hover:bg-black/50 h-8 w-8 flex items-center justify-center rounded-md cursor-pointer"
				>
					<MdOutlineClose size={22} />
				</div>

			</div>
		</div>
	);
};

export default ProfileDetail;