import React from "react";
import { Link } from "react-router-dom";

const Button = ({ value, buttonTo }) => {
  return (
    <Link
      to={buttonTo}
      className="bg-red-600 p-2 rounded text-white font-semibold text-center hover:bg-red-700"
    >
      {value}
    </Link>
  );
};

export default Button;
