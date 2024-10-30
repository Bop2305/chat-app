import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import Modal from "@/components/Modal";
import chatService from "@/services/chat.service";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

type AddMemberProps = {
  chatId: number | undefined;
  isOpen: boolean;
  onClose: () => void;
};

const AddMemberModal: React.FC<AddMemberProps> = ({
  chatId,
  isOpen,
  onClose,
}) => {
  const [participants, setParticipants] = useState<string[]>([]);

  const formResult = useForm();

  const handleAddParticipant = (values: any) => {
    setParticipants((prevValue) => [...prevValue, values.participant]);
  };

  const handleSubmit = async () => {
    if (!chatId) return;
    const res = await chatService.addMember(chatId, participants);

    if (res?.error) {
      toast.error(res?.message);
      setParticipants([]);
      return;
    }

    toast.success("Add member success!");

    onClose();
  };

  return (
    <Modal
      title="Add Members"
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

export default AddMemberModal;
