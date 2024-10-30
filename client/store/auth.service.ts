import axiosClient from "@/utils/axiosClient";

export type SignInDto = {
  email: string;
  password: string;
};

export type SignUpDto = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

const signIn = async (data: SignInDto) => {
  const res = await axiosClient.post("/auth/login", data);

  return res.data.data;
};

const signUp = async (data: SignUpDto) => {
  const res = await axiosClient.post("/auth/register", data);

  return res.data.data;
};

const authService = {
  signIn,
  signUp,
};

export default authService;
