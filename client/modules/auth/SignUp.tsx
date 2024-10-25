"use client";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import authService from "@/store/auth.service";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const SignUp: React.FC = () => {
  const router = useRouter();

  const schema = yup
    .object({
      firstName: yup.string().required("First Name required"),
      lastName: yup.string().required("Last Name required"),
      email: yup.string().required("Email required"),
      password: yup.string().required("Password required"),
    })
    .required();

  const defaultValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  };

  const formResult = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const onSubmit = async (values: any) => {
    console.log(values);
    const res = await authService.signUp(values);

    if (res) router.push("/login");
  };

  return (
    <>
      <div className="flex flex-col mx-auto mt-[50px] w-[500px]">
        <h2 className="text-2xl text-gray-700 mb-4 text-center">
          Create a new account
        </h2>
        <FormInput
          label="First Name"
          name="firstName"
          register={formResult.register}
          errors={formResult.formState.errors.firstName}
        />
        <FormInput
          label="Last Name"
          name="lastName"
          register={formResult.register}
          errors={formResult.formState.errors.lastName}
        />
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
        <Link className="mt-4 text-md text-green-700" href={"/login"}>
          Already have an account
        </Link>
      </div>
    </>
  );
};

export default SignUp;
