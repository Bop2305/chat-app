"use client";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import userService from "@/services/user.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const Profile: React.FC = () => {
  const [user, setUser] = useState<Record<string, any>>();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await userService.getUserById();
      setUser(user);
    };

    fetchUser();
  }, []);

  const schema = yup
    .object({
      firstName: yup.string().required("First Name required"),
      lastName: yup.string().required("Last Name required"),
      email: yup.string().required("Email required"),
    })
    .required();

  const formResult = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    formResult.setValue("firstName", user?.firstName);
    formResult.setValue("lastName", user?.lastName);
    formResult.setValue("email", user?.email);
  }, [user]);

  const onSubmit = async (values: any) => {
    console.log(values);
    await userService.updateUser(values);
  };

  return (
    <>
      <div className="flex flex-col mx-auto mt-[50px] w-[500px]">
        <h2 className="text-2xl text-gray-700 mb-4 text-center">Profile</h2>
        <FormInput
          label="First Name"
          name="firstName"
          register={formResult.register}
          errors={formResult.formState.errors.firstName as any}
        />
        <FormInput
          label="Last Name"
          name="lastName"
          register={formResult.register}
          errors={formResult.formState.errors.lastName as any}
        />
        <FormInput
          label="Email"
          name="email"
          register={formResult.register}
          errors={formResult.formState.errors.email as any}
        />
        <Button
          type="button"
          label="Update"
          onClick={formResult.handleSubmit(onSubmit)}
        />
      </div>
    </>
  );
};

export default Profile;
