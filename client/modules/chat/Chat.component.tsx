"use client";

import ChatDetail from "./ChatDetail";
import Conversations from "./Conversations";

const Chat: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-12 px-6 lg:px-8">
        <div className="col-span-3">
          <Conversations />
        </div>
        <div className="col-span-9">
          <ChatDetail />
        </div>
      </div>
    </>
  );
};

export default Chat;
