import React from "react";

interface RadioGroupProps {
  children: React.ReactNode;
  name?: string;
  className?: string;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ children, name, className }) => {
  return (
    <div className={`space-y-2 ${className || ""}`} role="radiogroup">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { name });
        }
        return child;
      })}
    </div>
  );
};

export default RadioGroup;
