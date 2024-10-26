import React from "react";

interface ButtonProps {
  label: string;
  onClick: (e: any) => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  height?: "sm" | "md" | "lg" | "xl";
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  type = "button",
  disabled = false,
  height,
}) => {
  const setHeight = () => {
    switch (height) {
      case "sm":
        return "24px";

      case "md":
        return "48px";

      case "xl":
        return "60px";

      default:
        return "36px";
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ height: setHeight() }}
      className={`px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm 
      hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
      disabled:bg-gray-400 disabled:cursor-not-allowed`}
    >
      {label}
    </button>
  );
};

export default Button;
