import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import Modal from "@/components/Modal";
import useSocket from "@/hooks/useSocket";
import { useState } from "react";
import { useForm } from "react-hook-form";

type CreateChatModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CreateChatModal: React.FC<CreateChatModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [participants, setParticipants] = useState<string[]>([]);

  const { socket } = useSocket();

  const formResult = useForm();

  const handleAddParticipant = (values: any) => {
    setParticipants((prevValue) => [...prevValue, values.participant]);
  };

  const handleSubmit = async () => {
    socket.emit("createConversation", { participants });

    onClose();
  };

  return (
    <Modal
      title="Create Chat"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={() => handleSubmit()}
    >
      <div>
        <div className="flex gap-2">
          <FormInput
            name="participant"
            placeholder="Input Participant Email"
            register={formResult.register}
          />
          <Button
            label="Add"
            onClick={formResult.handleSubmit(handleAddParticipant)}
          />
        </div>
        <ul className="mt-1 mb-2">
          {participants.map((item) => {
            return <li key={item}>{item}</li>;
          })}
        </ul>
        {/* <Button label="Create" onClick={() => console.log("On Click")} /> */}
      </div>
    </Modal>
  );
};

export default CreateChatModal;
