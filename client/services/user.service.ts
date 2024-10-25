import axiosClient from "@/utils/axiosClient";

type UpdateUserDto = {
  firstName: string;
  lastName: string;
  email: string;
}

const getUserById = async () => {
  try {
    const res = await axiosClient.get(`/user/me`);

    return res.data;
  } catch (error) {
    console.log(error);
  }
}

const updateUser = async (user: UpdateUserDto) => {
  try {
    const res = await axiosClient.post(`/user/me`, user)

    return res.data;
  } catch (error) {
    console.log(error);
  }
}

const userService = {
  getUserById,
  updateUser
}

export default userService;