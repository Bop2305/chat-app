import React from "react";

interface ButtonProps {
  label: string;
  onClick: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  type = "button",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm 
      hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
      disabled:bg-gray-400 disabled:cursor-not-allowed`}
    >
      {label}
    </button>
  );
};

export default Button;
