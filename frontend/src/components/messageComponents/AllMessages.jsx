// import React, { Fragment, useEffect, useRef, useState } from "react";
// import { useSelector } from "react-redux";
// import { VscCheckAll } from "react-icons/vsc";
// import { CgChevronDoubleDown } from "react-icons/cg";
// import {
//     SimpleDateAndTime,
//     SimpleDateMonthDay,
//     SimpleTime,
// } from "../../utils/formateDateTime";

// const AllMessages = ({ allMessage }) => {
//     const chatBox = useRef();
//     const adminId = useSelector((store) => store.auth?._id);
//     const isTyping = useSelector((store) => store?.condition?.isTyping);

//     const [scrollShow, setScrollShow] = useState(true);
//     // Handle Chat Box Scroll Down
//     const handleScrollDownChat = () => {
//         if (chatBox.current) {
//             chatBox.current.scrollTo({
//                 top: chatBox.current.scrollHeight,
//                 // behavior: "auto",
//             });
//         }
//     };
//     // Scroll Button Hidden
//     useEffect(() => {
//         handleScrollDownChat();
//         if (chatBox.current.scrollHeight == chatBox.current.clientHeight) {
//             setScrollShow(false);
//         }
//         const handleScroll = () => {
//             const currentScrollPos = chatBox.current.scrollTop;
//             if (
//                 currentScrollPos + chatBox.current.clientHeight <
//                 chatBox.current.scrollHeight - 30
//             ) {
//                 setScrollShow(true);
//             } else {
//                 setScrollShow(false);
//             }
//         };
//         const chatBoxCurrent = chatBox.current;
//         chatBoxCurrent.addEventListener("scroll", handleScroll);
//         return () => {
//             chatBoxCurrent.removeEventListener("scroll", handleScroll);
//         };
//     }, [allMessage, isTyping]);

//     return (
//         <>
//             {scrollShow && (
//                 <div
//                     className="absolute bottom-16 right-4 cursor-pointer z-20 font-light text-white/50 bg-black/80 hover:bg-black hover:text-white p-1.5 rounded-full"
//                     onClick={handleScrollDownChat}
//                 >
//                     <CgChevronDoubleDown title="Scroll Down" fontSize={24} />
//                 </div>
//             )}
//             <div
//                 className="flex flex-col w-full px-3 gap-1 py-2 overflow-y-auto overflow-hidden scroll-style h-[66vh]"
//                 ref={chatBox}
//             >
//                 {allMessage?.map((message, idx) => {
//                     return (
//                         <Fragment key={message._id}>
//                             <div className="sticky top-0 flex w-full justify-center z-10">
//                                 {new Date(
//                                     allMessage[idx - 1]?.updatedAt
//                                 ).toDateString() !==
//                                     new Date(
//                                         message?.updatedAt
//                                     ).toDateString() && (
//                                     <span className="text-xs font-light mb-2 mt-1 text-white/50 bg-black h-7 w-fit px-5 rounded-md flex items-center justify-center cursor-pointer">
//                                         {SimpleDateMonthDay(message?.updatedAt)}
//                                     </span>
//                                 )}
//                             </div>
//                             <div
//                                 className={`flex items-start gap-1 ${
//                                     message?.sender?._id === adminId
//                                         ? "flex-row-reverse text-white"
//                                         : "flex-row text-black"
//                                 }`}
//                             >
//                                 {message?.chat?.isGroupChat &&
//                                     message?.sender?._id !== adminId &&
//                                     (allMessage[idx + 1]?.sender?._id !==
//                                     message?.sender?._id ? (
//                                         <img
//                                             src={message?.sender?.image}
//                                             alt=""
//                                             className="h-9 w-9 rounded-full"
//                                         />
//                                     ) : (
//                                         <div className="h-9 w-9 rounded-full"></div>
//                                     ))}
//                                 <div
//                                     className={`${
//                                         message?.sender?._id === adminId
//                                             ? "bg-gradient-to-tr to-slate-800 from-green-400 rounded-s-lg rounded-ee-2xl"
//                                             : "bg-gradient-to-tr to-slate-800 from-white rounded-e-lg rounded-es-2xl"
//                                     } py-1.5 px-2 min-w-10 text-start flex flex-col relative max-w-[85%]`}
//                                 >
//                                     {message?.chat?.isGroupChat &&
//                                         message?.sender?._id !== adminId && (
//                                             <span className="text-xs font-bold text-start text-green-900">
//                                                 {message?.sender?.firstName}
//                                             </span>
//                                         )}
//                                     <div
//                                         className={`mt-1 pb-1.5 ${
//                                             message?.sender?._id == adminId
//                                                 ? "pr-16"
//                                                 : "pr-12"
//                                         }`}
//                                     >
//                                         <span className="">
//                                             {message?.message}
//                                         </span>
//                                         <span
//                                             className="text-[11px] font-light absolute bottom-1 right-2 flex items-end gap-1.5"
//                                             title={SimpleDateAndTime(
//                                                 message?.updatedAt
//                                             )}
//                                         >
//                                             {SimpleTime(message?.updatedAt)}
//                                             {message?.sender?._id ===
//                                                 adminId && (
//                                                 <VscCheckAll
//                                                     color="white"
//                                                     fontSize={14}
//                                                 />
//                                             )}
//                                         </span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </Fragment>
//                     );
//                 })}
//                 {isTyping && (
//                     <div id="typing-animation">
//                         <span></span>
//                         <span></span>
//                         <span></span>
//                     </div>
//                 )}
//             </div>
//         </>
//     );
// };

// export default AllMessages;

import React, { Fragment, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { VscCheckAll } from "react-icons/vsc";
import { CgChevronDoubleDown } from "react-icons/cg";
import {
	SimpleDateAndTime,
	SimpleDateMonthDay,
	SimpleTime,
} from "../../utils/formateDateTime";

const AllMessages = ({ allMessage }) => {
	const chatBox = useRef();
	const adminId = useSelector((store) => store.auth?._id);
	const isTyping = useSelector((store) => store?.condition?.isTyping);

	const [scrollShow, setScrollShow] = useState(true);

	const handleScrollDownChat = () => {
		if (chatBox.current) {
			chatBox.current.scrollTo({
				top: chatBox.current.scrollHeight,
			});
		}
	};

	useEffect(() => {
		handleScrollDownChat();

		if (chatBox.current) {
			setScrollShow(
				chatBox.current.scrollHeight !== chatBox.current.clientHeight
			);

			const handleScroll = () => {
				const el = chatBox.current;

				if (
					el.scrollTop + el.clientHeight <
					el.scrollHeight - 30
				) {
					setScrollShow(true);
				} else {
					setScrollShow(false);
				}
			};

			chatBox.current.addEventListener("scroll", handleScroll);

			return () => {
				chatBox.current?.removeEventListener("scroll", handleScroll);
			};
		}
	}, [allMessage, isTyping]);

	return (
		<>
			{/* Scroll Button */}
			{scrollShow && (
				<div
					className="absolute bottom-16 right-4 cursor-pointer z-20 text-white/50 bg-black/80 hover:bg-black hover:text-white p-1.5 rounded-full"
					onClick={handleScrollDownChat}
				>
					<CgChevronDoubleDown fontSize={24} />
				</div>
			)}

			{/* Chat Container */}
			<div
				ref={chatBox}
				className="flex flex-col w-full px-3 gap-2 py-2 overflow-y-auto h-[66vh] scroll-style"
			>
				{allMessage?.map((message, idx) => (
					<Fragment key={message._id}>
						{/* Date Separator */}
						<div className="flex justify-center sticky top-0 z-10">
							{new Date(
								allMessage[idx - 1]?.updatedAt
							).toDateString() !==
								new Date(message?.updatedAt).toDateString() && (
								<span className="text-xs font-light mb-2 mt-1 text-white/50 bg-black h-7 px-5 rounded-md flex items-center">
									{SimpleDateMonthDay(message?.updatedAt)}
								</span>
							)}
						</div>

						{/* Message Row */}
						<div
							className={`flex items-start gap-2 ${
								message?.sender?._id === adminId
									? "flex-row-reverse text-white"
									: "flex-row text-black"
							}`}
						>
							{/* Group Avatar */}
							{message?.chat?.isGroupChat &&
								message?.sender?._id !== adminId &&
								(allMessage[idx + 1]?.sender?._id !==
								message?.sender?._id ? (
									<img
										src={message?.sender?.image}
										alt=""
										className="h-9 w-9 rounded-full"
									/>
								) : (
									<div className="h-9 w-9 rounded-full" />
								))}

							{/* Message Bubble */}
							<div
								className={`relative max-w-[85%] py-1.5 px-2 flex flex-col ${
									message?.sender?._id === adminId
										? "bg-gradient-to-tr from-green-400 to-slate-800 rounded-s-lg rounded-ee-2xl"
										: "bg-gradient-to-tr from-white to-slate-800 rounded-e-lg rounded-es-2xl"
								}`}
							>
								{/* Sender name */}
								{message?.chat?.isGroupChat &&
									message?.sender?._id !== adminId && (
										<span className="text-xs font-bold text-green-900">
											{message?.sender?.firstName}
										</span>
									)}

								{/* TEXT */}
								{message?.message && (
									<span className="mt-1 text-sm">
										{message.message}
									</span>
								)}

								{/* IMAGE (FIXED SIZE) */}
								{message?.image && (
									<img
										src={message.image}
										alt="chat"
										className="max-w-[200px] max-h-[200px] w-auto h-auto rounded-md mt-2 object-cover cursor-pointer"
										onClick={() =>
											window.open(message.image, "_blank")
										}
									/>
								)}

								{/* Time + status */}
								<span
									className="text-[11px] font-light absolute bottom-1 right-2 flex items-center gap-1.5"
									title={SimpleDateAndTime(message?.updatedAt)}
								>
									{SimpleTime(message?.updatedAt)}
									{message?.sender?._id === adminId && (
										<VscCheckAll fontSize={14} />
									)}
								</span>
							</div>
						</div>
					</Fragment>
				))}

				{/* Typing indicator */}
				{isTyping && (
					<div id="typing-animation">
						<span></span>
						<span></span>
						<span></span>
					</div>
				)}
			</div>
		</>
	);
};

export default AllMessages;