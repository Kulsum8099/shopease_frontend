import React from "react";
import { UseFormRegister } from "react-hook-form";

interface InputProps {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  register: UseFormRegister<any>;
  error?: any;
  required?: boolean;
  defaultValue?: any;
}

const Input: React.FC<InputProps> = ({
  label,
  name,
  type,
  placeholder,
  register,
  error,
  required = false,
  defaultValue
}) => {
  return (
    <div className="flex flex-col gap-2 col-span-1">
      <label className="text-gray-800 font-medium">
        {label}: {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        {...register(name, { required })}
        className={`w-full px-4 py-4 border rounded-md focus:outline-primary ${error ? "border-red-500" : "border-gray-300"
          }`}
        defaultValue={defaultValue}
      />
      {error && (
        <p className="text-sm text-red-500">
          {error.message || `${label} is required`}
        </p>
      )}
    </div>
  );
};

export default Input;
