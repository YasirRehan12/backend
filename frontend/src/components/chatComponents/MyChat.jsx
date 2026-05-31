

import React, { useEffect } from "react";
import { FaPenAlt } from "react-icons/fa";
import { addMyChat, addSelectedChat } from "../../redux/slices/myChatSlice";
import { useDispatch, useSelector } from "react-redux";
import {
    setChatLoading,
    setGroupChatBox,
} from "../../redux/slices/conditionSlice";
import ChatShimmer from "../loading/ChatShimmer";
import getChatName, { getChatImage } from "../../utils/getChatName";
import { VscCheckAll } from "react-icons/vsc";
import { SimpleTime } from "../../utils/formateDateTime";

const FALLBACK_IMAGE =
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const MyChat = () => {
    const dispatch = useDispatch();

    const myChat = useSelector((store) => store.myChat.chat);
    const authUserId = useSelector((store) => store?.auth?._id);
    const selectedChat = useSelector((store) => store?.myChat?.selectedChat);
    console.log("CHAT SAMPLE:", myChat?.[0]);
    console.log("USERS:", myChat?.[0]?.users);
    const isChatLoading = useSelector(
        (store) => store?.condition?.isChatLoading
    );

    const newMessageId = useSelector((store) => store?.message?.newMessageId);
    const isGroupChatId = useSelector((store) => store.condition.isGroupChatId);

    useEffect(() => {
        const getMyChat = () => {
            dispatch(setChatLoading(true));
            const token = localStorage.getItem("token");

            fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((json) => {
                    dispatch(addMyChat(json?.data || []));
                    dispatch(setChatLoading(false));
                })
                .catch(() => {
                    dispatch(setChatLoading(false));
                });
        };

        getMyChat();
    }, [newMessageId, isGroupChatId]);

    const handleImageError = (e) => {
        e.target.src = FALLBACK_IMAGE;
    };

    return (
        <>
            {/* HEADER */}
            <div className="p-6 w-full h-[7vh] font-semibold flex justify-between items-center bg-slate-800 text-white border-slate-500 border-r">
                <h1>My Chat</h1>

                <div
                    className="flex items-center gap-2 border border-slate-600 py-1 px-2 rounded-md cursor-pointer hover:bg-slate-600"
                    onClick={() => dispatch(setGroupChatBox())}
                >
                    New Group <FaPenAlt />
                </div>
            </div>

            {/* CHAT LIST */}
            <div className="flex flex-col w-full px-4 gap-1 py-2 overflow-y-auto h-[73vh] scroll-style">
                {isChatLoading ? (
                    <ChatShimmer />
                ) : (
                    <>
                        {myChat?.length === 0 && (
                            <div className="w-full h-full flex justify-center items-center text-white">
                                Start a new conversation
                            </div>
                        )}

                        {myChat?.map((chat) => {
                            const chatImage = getChatImage(chat, authUserId);

                            return (
                                <div
                                    key={chat?._id}
                                    onClick={() =>
                                        dispatch(addSelectedChat(chat))
                                    }
                                    className={`w-full h-16 border border-slate-500 rounded-lg flex items-center p-2 gap-2 cursor-pointer transition-all ${selectedChat?._id === chat?._id
                                            ? "bg-slate-600 text-black"
                                            : "text-white hover:bg-black/40"
                                        }`}
                                >
                                    <img
                                        src={chatImage}
                                        alt="chat"
                                        onError={handleImageError}
                                        className="h-12 w-12 rounded-full object-cover"
                                    />

                                    <div className="w-full">
                                        <div className="flex justify-between">
                                            <span className="line-clamp-1">
                                                {getChatName(chat, authUserId)}
                                            </span>

                                            <span className="text-xs">
                                                {chat?.latestMessage &&
                                                    SimpleTime(
                                                        chat?.latestMessage
                                                            ?.createdAt
                                                    )}
                                            </span>
                                        </div>

                                        <div className="text-xs line-clamp-1 flex items-center gap-1">
                                            {chat?.latestMessage?.sender
                                                ?._id === authUserId && (
                                                    <VscCheckAll fontSize={14} />
                                                )}
                                            {chat?.latestMessage?.message}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </>
                )}
            </div>
        </>
    );
};

export default MyChat;


