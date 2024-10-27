import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import chatService from "@/services/chat.service";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import io from "socket.io-client";

type ChatDetailProps = {
  selectedChatId: number | undefined;
};

const ChatDetail: React.FC<ChatDetailProps> = ({ selectedChatId }) => {
  const [chat, setChat] = useState<Record<string, any>>({});
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    async function fetchChats() {
      if (!selectedChatId) return;

      const data = await chatService.getChatById(selectedChatId);

      if (data) {
        setChat(data);
      }
    }

    fetchChats();
  }, [selectedChatId]);

  useEffect(() => {
    const newSocket = io("http://localhost:8000", {
      reconnection: true,
      reconnectionAttempts: 5, // Adjust as needed
      reconnectionDelay: 1000, // 1 second between attempts
    });
    setSocket(newSocket);

    if (newSocket) {
      console.log("newSocket", newSocket.connected);
    }

    newSocket.on("connect", () => {
      console.log("Connected to WS server");
      if (selectedChatId) {
        newSocket.emit("joinChat", selectedChatId);

        newSocket.on("receiveMessage", (newChat) => {
          setMessages(newChat.messages);
        });
      }
    });

    return () => {
      // newSocket.off('receiveMessage');
      newSocket.close();
    };
  }, [selectedChatId]);

  const sendMessage = (values: any) => {
    socket.emit("sendMessage", {
      chatId: selectedChatId,
      userId: localStorage.getItem("userId"),
      content: values?.msg,
    });
  };

  const formResult = useForm();

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md mx-auto">
      <div className="flex flex-col gap-4 overflow-y-auto max-h-[400px]">
        {messages?.map((item: any) => (
          <div
            key={item?.id}
            className="bg-white p-3 rounded-lg border shadow-sm"
          >
            <p className="text-sm font-semibold text-gray-700">
              {item.senderId}
            </p>
            <p className="text-sm text-gray-600 mt-1">{item.content}</p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(item.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-4">
        <FormInput name="msg" register={formResult.register} />
        <Button
          label="Send"
          height="lg"
          onClick={formResult.handleSubmit(sendMessage)}
        />
      </div>
    </div>
  );
};

export default ChatDetail;
