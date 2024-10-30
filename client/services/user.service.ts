import axiosClient from "@/utils/axiosClient";
import { toast } from "react-toastify";

type UpdateUserDto = {
  firstName: string;
  lastName: string;
  email: string;
};

const getUserById = async () => {
  try {
    const res = await axiosClient.get(`/user/me`);

    return res.data.data;
  } catch (error) {
    console.log(error);
  }
};

const updateUser = async (user: UpdateUserDto) => {
  try {
    const res = await axiosClient.post(`/user/me`, user);

    if (res.data?.statusCode !== 201) {
      toast.error(res.data?.message);
    }

    return res.data.data;
  } catch (error) {
    console.log(error);
  }
};

const userService = {
  getUserById,
  updateUser,
};

export default userService;
