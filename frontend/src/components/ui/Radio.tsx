import React from "react";

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Radio: React.FC<RadioProps> = ({ label, className, ...props }) => {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input type="radio" className={`w-4 h-4 text-blue-600 focus:ring-blue-500 ${className || ""}`} {...props} />
      {label && <span className="text-gray-700">{label}</span>}
    </label>
  );
};

export default Radio;
