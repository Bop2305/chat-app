import Button from "@/components/Button";
import CreateChatModal from "./CreateChatModal";
import { useEffect, useState } from "react";
import chatService from "@/services/chat.service";

type ConversationsProps = {
  selectedChatId: number | undefined;
  setSelectedChatId: (selectedChatId: number | undefined) => void;
};

const Conversations: React.FC<ConversationsProps> = ({
  selectedChatId,
  setSelectedChatId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    async function fetchChats() {
      const data = await chatService.getChats();

      if (data) {
        setSelectedChatId(data[0]?.id);
        setChats(data);
      }
    }

    fetchChats();
  }, []);

  return (
    <>
      <div className="p-4 bg-gray-100 rounded-lg shadow-md max-w-sm mx-auto">
        <div className="flex justify-end">
          <Button label="Add" onClick={() => setIsOpen(true)} />
        </div>

        <ul className="space-y-2 mt-4">
          {chats.map((item: any) => (
            <li
              key={item?.id}
              onClick={() => setSelectedChatId(item?.id)}
              className={`p-3 rounded-lg cursor-pointer hover:bg-gray-200 transition ${
                selectedChatId === item?.id ? "bg-blue-200" : "bg-white"
              }`}
            >
              <p className="text-gray-700 font-medium">
                {item?.name || `Chat ${item?.id}`}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {isOpen && (
        <CreateChatModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
};

export default Conversations;
