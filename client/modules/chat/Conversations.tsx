import Button from "@/components/Button";
import CreateChatModal from "./CreateChatModal";
import { useState } from "react";

const data = ["Group 1", "Group 2", "Group 3"];

const Conversations: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div>
        <Button label="Add" onClick={() => setIsOpen(true)} height="lg" />
        <ul>
          {data.map((value, index) => {
            return <li key={index}>{value}</li>;
          })}
        </ul>
      </div>

      {isOpen && (
        <CreateChatModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
};

export default Conversations;
