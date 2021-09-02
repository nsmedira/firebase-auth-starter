import React from "react";

const Header = ({ heading = null }) => (
  <h2 className="text-center mb-4">{heading}</h2>
);

export default Header;
