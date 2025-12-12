"use client";
import React from "react";

interface FormInputProps {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  value,
  placeholder,
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm font-medium">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="border rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-green-500"
      />
    </div>
  );
};

export default FormInput; 
