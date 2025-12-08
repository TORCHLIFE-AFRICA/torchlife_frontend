"use client";
import React from "react";

interface DateInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DateInput: React.FC<DateInputProps> = ({
  label,
  name,
  value,
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm font-medium">{label}</label>
      <input
        type="date"
        name={name}
        value={value}
        onChange={onChange}
        className="border rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-green-500"
      />
    </div>
  );
};

export default DateInput;