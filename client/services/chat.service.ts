import axiosClient from "@/utils/axiosClient";
import { toast } from "react-toastify";

type CreateChatDto = {
  participants: string[];
};

type AddMemberDto = Partial<CreateChatDto>;

const getChats = async () => {
  try {
    const res = await axiosClient.get("/chat");

    return res.data.data;
  } catch (error) {
    console.log(error);
  }
};

const getChatById = async (id: number) => {
  try {
    const res = await axiosClient.get(`/chat/${id}`);

    return res.data.data;
  } catch (error) {
    console.log(error);
  }
};

const createChat = async (data: CreateChatDto) => {
  try {
    const res = await axiosClient.post("/chat", data);

    return res.data.data;
  } catch (error) {
    console.log(error);
  }
};

const addMember = async (chatId: number, data: string[]) => {
  try {
    const res = await axiosClient.post(`/chat/add-member/${chatId}`, data);

    return res.data;
  } catch (error) {
    console.log("error", error);
    console.log(error);
  }
};

const chatService = {
  getChats,
  getChatById,
  createChat,
  addMember,
};

export default chatService;
