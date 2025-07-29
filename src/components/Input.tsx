import React from "react";

export interface InputProps {
  type: string;
  placeholder: string;
  icon?: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  hasError?: boolean;
}

export const Input: React.FC<InputProps> = ({
  type, placeholder, icon, value,
  onChange, onBlur, hasError }) => (
  <div className="w-full"
    style={{
      display: "flex",
      alignItems: "center",
      border: `1px solid ${hasError ? "#dc2626" : "#003194"}`,
      borderRadius: "10px",
      padding: "0 0px",
      background: "#fff",
      height: "48px",
      width: "100%",
    }}
  >
    {icon && (
      <span style={{ color: hasError ? "#dc2626" : "#003194", marginLeft: 10, marginRight: 10 }}>{icon}</span>
    )}
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      style={{
        border: "none",
        outline: "none",
        background: "transparent",
        fontSize: "17px",
        width: "100%",
      }}
    />
  </div>
);
