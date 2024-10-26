import Button from "@/components/Button";
import FormInput from "@/components/FormInput";

const data = [
  {
    sender: "Mr.A",
    content: "Hi",
    timestamp: "2024-10-16 14:30:00",
  },
  {
    sender: "Mr.B",
    content: "Hi",
    timestamp: "2024-10-16 14:30:00",
  },
  {
    sender: "Mr.A",
    content: "How are you?",
    timestamp: "2024-10-16 14:30:00",
  },
];

const ChatDetail: React.FC = () => {
  return (
    <>
      <div>
        <div className="flex flex-col gap-2">
          {data.map((item, index) => {
            return (
              <ul key={index} className="border p-2 rounded-md">
                <li>{item.sender}</li>
                <li>{item.content}</li>
                <li>{item.timestamp}</li>
              </ul>
            );
          })}
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
    </>
  );
};

export default ChatDetail;
