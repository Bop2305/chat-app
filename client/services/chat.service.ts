import axiosClient from "@/utils/axiosClient";

type CreateChatDto = {
  participants: string[];
};

const getChats = async () => {
  try {
    const res = await axiosClient.get("/chat");

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const getChatById = async (id: number) => {
  try {
    const res = await axiosClient.get(`/chat/${id}`);

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const createChat = async (data: CreateChatDto) => {
  try {
    const res = await axiosClient.post("/chat", data);

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const chatService = {
  getChats,
  getChatById,
  createChat,
};

export default chatService;
