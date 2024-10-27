import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import chatService from "@/services/chat.service";
import { useEffect, useState } from "react";

type ChatDetailProps = {
  selectedChatId: number | undefined;
};

const ChatDetail: React.FC<ChatDetailProps> = ({ selectedChatId }) => {
  const [chat, setChat] = useState<Record<string, any>>({});

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

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md mx-auto">
      <div className="flex flex-col gap-4 overflow-y-auto max-h-[400px]">
        {chat?.messages?.map((item: any) => (
          <div
            key={item?.id}
            className="bg-white p-3 rounded-lg border shadow-sm"
          >
            <p className="text-sm font-semibold text-gray-700">{item.sender}</p>
            <p className="text-sm text-gray-600 mt-1">{item.content}</p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(item.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
        <div className="bg-white p-3 rounded-lg border shadow-sm">
          <p className="text-sm font-semibold text-gray-700">Mr.A</p>
          <p className="text-sm text-gray-600 mt-1">Hello</p>
          <p className="text-xs text-gray-400 mt-1">27/10/2024</p>
        </div>
        <div className="bg-white p-3 rounded-lg border shadow-sm">
          <p className="text-sm font-semibold text-gray-700">Mr.A</p>
          <p className="text-sm text-gray-600 mt-1">Hello</p>
          <p className="text-xs text-gray-400 mt-1">27/10/2024</p>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <FormInput name="msg" />
        <Button
          label="Send"
          height="lg"
          onClick={() => console.log("On Click")}
        />
      </div>
    </div>
  );
};

export default ChatDetail;
