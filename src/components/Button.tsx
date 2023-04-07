import React from "react";

const Button = ({
  onClick,
  children,
}: {
  children: React.ReactNode;
  onClick: React.MouseEventHandler;
}) => (
  <button
    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-3 rounded"
    onClick={onClick}
  >
    {children}
  </button>
);

export default Button;
