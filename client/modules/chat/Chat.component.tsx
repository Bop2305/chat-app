"use client";

import { useState } from "react";
import ChatDetail from "./ChatDetail";
import Conversations from "./Conversations";

const Chat: React.FC = () => {
  const [selectedChatId, setSelectedChatId] = useState<number>();

  return (
    <>
      <div className="grid grid-cols-12 px-6 lg:px-8 gap-6">
        <div className="col-span-3">
          <Conversations
            selectedChatId={selectedChatId}
            setSelectedChatId={setSelectedChatId}
          />
        </div>
        <div className="col-span-9">
          <ChatDetail selectedChatId={selectedChatId} />
        </div>
      </div>
    </>
  );
};

export default Chat;
