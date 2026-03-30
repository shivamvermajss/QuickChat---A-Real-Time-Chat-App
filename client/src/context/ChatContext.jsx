import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});

    const { socket, axios } = useContext(AuthContext);

    // get all users
    const getAllUsers = async () => {
        try {
            const { data } = await axios.get('/api/messages/users');
            if (data.success) {   
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // get messages
    const getMessages = async (userId) => {
        try {
            const { data } = await axios.get(`/api/messages/${userId}`);
            if (data.success) {
                setMessages(data.messages);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // send message
    const sendMessage = async (messageData) => {
        try {
            const { data } = await axios.post(`/api/messages/send/${selectedChat._id}`, messageData);
            if (data.success) {
                setMessages((prev) => [...prev, data.message]);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // subscribe
    const subscribeToMessages = () => {
        if (!socket) return;

        socket.on('newMessage', (newMessage) => {
            if (selectedChat && newMessage.senderId === selectedChat._id) { // ✅ fixed
                newMessage.seen = true;
                setMessages((prev) => [...prev, newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`);
            } else {
                setUnseenMessages((prev) => ({
                    ...prev,
                    [newMessage.senderId]: prev[newMessage.senderId]
                        ? prev[newMessage.senderId] + 1
                        : 1
                }));
            }
        });
    };

    // unsubscribe
    const unsubscribeFromMessages = () => {
        if (socket) socket.off('newMessage');
    };

    
    useEffect(() => {
        subscribeToMessages();
        return () => unsubscribeFromMessages();
    }, [socket, selectedChat]);

    const value = {
        messages,
        setMessages,
        users,
        selectedChat,
        setSelectedChat,
        unseenMessages,
        setUnseenMessages,
        getAllUsers,   // ✅ fixed name
        getMessages,
        sendMessage
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};