"use client";
import React, { TextareaHTMLAttributes } from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  rows?: number;
  height?: string | number;
}

const TextArea = ({ label, rows = 4, height, ...props }: TextAreaProps) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      {label && <label style={{ marginBottom: 4, fontWeight: 500 }}>{label}</label>}
      <textarea
        rows={rows}
        style={{
          width: "100%",
          padding: "8px 12px",
          borderRadius: 4,
          border: "1px solid #ccc",
          fontFamily: "inherit",
          fontSize: "1rem",
          resize: "none",
          height: height,
        }}
        {...props}
      />
    </div>
  );
};

<<<<<<< HEAD
export { TextArea };
=======
export { TextArea };
>>>>>>> 147f3376b56b8579c8dfd3621d0a34fe99c66b08
