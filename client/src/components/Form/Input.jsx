import React from "react";

const Input = ({ name ,onChange}) => {
  return (
    <input
      className="bg-zinc-800 p-3 md:p-4 rounded text-white"
      placeholder={name}
      type="text"
      onChange={onChange}
    />
  );
};

export default Input;
