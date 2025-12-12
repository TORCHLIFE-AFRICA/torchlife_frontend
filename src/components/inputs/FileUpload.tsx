"use client";
import React, { useState } from "react";

interface FileUploadProps {
  label: string;
  onFileSelect: (file: File | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ label, onFileSelect }) => {
  const [fileName, setFileName] = useState("");

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onFileSelect(file);
    if (file) setFileName(file.name);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0] || null;
    onFileSelect(file);
    if (file) setFileName(file.name);
  };

  return (
    <div className="flex flex-col w-full">
      <label className="text-sm font-medium mb-1">{label}</label>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="border-2 border-dashed rounded-md py-8 px-4 flex flex-col items-center text-center"
      >
        <input type="file" id="fileUpload" hidden onChange={handleSelect} />

        <p className="text-gray-600 text-sm">
          Drag and drop file or{" "}
          <label htmlFor="fileUpload" className="text-green-600 cursor-pointer">
            Click to browse
          </label>
        </p>

        <p className="text-xs mt-2 text-gray-400">
          Accepted: PDF, JPG, PNG. Max size: 10MB
        </p>

        {fileName && (
          <p className="mt-3 text-sm text-green-700 font-medium">{fileName}</p>
        )}
      </div>
    </div>
  );
};

export default FileUpload; 
