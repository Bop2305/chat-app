import React from "react";
import { FieldError, FieldValues, UseFormRegister } from "react-hook-form";

interface FormInputProps {
  label?: string;
  name: string;
  register?: any;
  errors?: FieldError;
  type?: string;
  placeholder?: string;
  [x: string]: any; // For passing additional props
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  register,
  errors,
  type = "text",
  placeholder,
  ...rest
}) => {
  return (
    <div className="mb-4 w-full">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        {...(register ? register(name) : {})}
        className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors ? "border-red-500" : "border-gray-300"}`}
        {...rest}
      />
      {errors && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
    </div>
  );
};

export default FormInput;
