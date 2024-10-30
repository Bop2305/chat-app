import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import chatService from "@/services/chat.service";
import {
  Cog6ToothIcon,
  InformationCircleIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import io from "socket.io-client";
import AddMemberModal from "./AddMemberModal";
import { toast } from "react-toastify";

type ChatDetailProps = {
  selectedChatId: number | undefined;
};

enum ModalName {
  ADD_MEMBER = "ADD_MEMBER",
}

type Modal = {
  name: ModalName | "";
};

const defaultModalValue: Modal = {
  name: "",
};

const ChatDetail: React.FC<ChatDetailProps> = ({ selectedChatId }) => {
  const [chat, setChat] = useState<Record<string, any>>({});
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState<any>(null);
  const [showRightMenu, setShowRightMenu] = useState<boolean>(false);
  const [modal, setModal] = useState<Modal>(defaultModalValue);

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
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      if (selectedChatId) {
        newSocket.emit("joinChat", selectedChatId);
        newSocket.on("receiveMessage", (newChat) => {
          setMessages(newChat.messages);
        });
      }
    });

    return () => {
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
    <div className="flex gap-4 w-full">
      {/* Chat Box */}
      <div className="bg-gray-100 p-4 rounded-lg shadow-md mx-auto w-full">
        <div
          className="flex justify-end h-10 cursor-pointer"
          onClick={() => setShowRightMenu(!showRightMenu)}
        >
          <InformationCircleIcon className="w-6 h-6 text-gray-600" />
        </div>
        <div className="flex flex-col gap-4 overflow-y-auto max-h-96 p-2">
          {messages?.map((item: any) => (
            <div
              key={item?.id}
              className="bg-white p-3 rounded-lg border shadow-sm flex flex-col"
            >
              <p className="text-sm font-semibold text-gray-700">
                {item.senderId}
              </p>
              <p className="text-sm text-gray-600 mt-1">{item.content}</p>
              <p className="text-xs text-gray-400 mt-1 self-end">
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

      {/* Settings Panel */}
      {showRightMenu && (
        <div className="bg-gray-100 p-4 rounded-lg shadow-md w-1/4 max-w-xs h-96">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Settings</h3>
            <Cog6ToothIcon className="w-6 h-6 text-gray-600" />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Chat settings and other options will go here.
          </p>
          <div className="flex justify-between items-center gap-4 pt-2 pb-2">
            <p className="text-md font-semibold">Add member</p>
            <PencilIcon
              className="w-4 h-4 text-gray-600 cursor-pointer"
              onClick={() => setModal({ name: ModalName.ADD_MEMBER })}
            />
          </div>
        </div>
      )}

      {modal.name === ModalName.ADD_MEMBER && (
        <AddMemberModal
          chatId={selectedChatId}
          onClose={() => setModal(defaultModalValue)}
          isOpen={modal.name === ModalName.ADD_MEMBER}
        />
      )}
    </div>
  );
};

export default ChatDetail;
