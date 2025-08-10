"use client";
import React, { useState } from "react";

const StartApplication = () => {
  const [hovered, setHovered] = useState(false);
  const buttonStyle = {
    paddingLeft: "30px",
    paddingRight: "30px",
    paddingTop: "5px",
    paddingBottom: "5px",
    borderRadius: "8px",
    background: hovered ? "rgb(255, 255, 255)" : "rgb(79, 70, 229)",
    color: hovered ? "rgb(79, 70, 229)" : "rgb(255, 255, 255)",
    border: `1px solid ${hovered ? "rgb(79, 70, 229)" : "rgb(79, 70, 229)"} `,
    transition: "background 0.3s, color 0.3s",
    cursor: "pointer",
  };
  return (
    <div>
      <button
        style={buttonStyle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        Start Your Application
      </button>
    </div>
  );
};

export default StartApplication;
