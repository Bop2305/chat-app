"use client";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import { signIn } from "@/store/auth.duck";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import * as yup from "yup";

type SignInProps = {
  signIn: (data: any, callback: () => void) => void;
};

const SignIn: React.FC<SignInProps> = ({ signIn }) => {
  const router = useRouter();

  const schema = yup
    .object({
      email: yup.string().required("Email required"),
      password: yup.string().required("Password required"),
    })
    .required();

  const defaultValues = {
    email: "",
    password: "",
  };

  const formResult = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const onSubmit = async (values: any) => {
    console.log(values);
    signIn(values, () => {
      router.push("/");
    });
  };

  return (
    <>
      <div className="flex flex-col mx-auto mt-[50px] w-[500px]">
        <h2 className="text-2xl text-gray-700 mb-4 text-center">Login</h2>
        <FormInput
          label="Email"
          name="email"
          register={formResult.register}
          errors={formResult.formState.errors.email}
        />
        <FormInput
          label="Password"
          name="password"
          register={formResult.register}
          errors={formResult.formState.errors.password}
        />
        <Button
          type="button"
          label="Sign In"
          onClick={formResult.handleSubmit(onSubmit)}
        />
        <Link className="mt-4 text-md text-green-700" href={"/register"}>
          Create new account
        </Link>
      </div>
    </>
  );
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    signIn: (data: any, callback: () => void) =>
      dispatch(signIn(data, callback)),
  };
};

export default connect(null, mapDispatchToProps)(SignIn);
