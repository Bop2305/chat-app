import axiosClient from "@/utils/axiosClient";

export type SignInDto = {
  userName: string;
  password: string;
};

export type SignUpDto = {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
};

const signIn = async (data: SignInDto) => {
  const res = await axiosClient.post("/login", data);

  return res;
};

const signUp = async (data: SignUpDto) => {
  const res = await axiosClient.post("/register", data);

  return res;
};

const authService = {
  signIn,
  signUp,
};

export default authService;
