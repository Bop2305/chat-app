import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import Modal from "@/components/Modal";
import chatService from "@/services/chat.service";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

type CreateChatModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CreateChatModal: React.FC<CreateChatModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [participants, setParticipants] = useState<string[]>([]);

  const formResult = useForm();

  const handleAddParticipant = (values: any) => {
    setParticipants((prevValue) => [...prevValue, values.participant]);
  };

  const handleSubmit = async () => {
    const res = await chatService.createChat({ participants });

    if (res?.status !== 200) {
      toast.error("Invalid Email");
      setParticipants([]);
      return;
    }

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
