import React from "react";

type InputFieldProps = {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  error?: string;
  isLoading?: boolean;
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  type = "text",
  error,
  isLoading = false
}) => (
  <div className="flex flex-col w-full gap-1">
    <span className="text-xs font-semibold text-text-tertiary">{label}</span>
    <input
      type={type}
      className="w-full text-[13px] text-text-sub p-1 bg-transparent border border-white/10 outline-none resize-none overflow-hidden rounded-lg px-4 py-3"
      value={value}
      onChange={onChange}
      disabled={isLoading}
    />
    {error && <span className="text-[#DF1C41] font-inter text-xs">{error}</span>}
  </div>
);

export default InputField;