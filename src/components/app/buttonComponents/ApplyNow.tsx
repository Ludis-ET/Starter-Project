"use client";
import React, { useState } from "react";

const ApplyNow = () => {
  const [hovered, setHovered] = useState(false);
  const buttonStyle = {
    paddingLeft: "30px",
    paddingRight: "30px",
    paddingTop: "7px",
    paddingBottom: "7px",
    borderRadius: "7px",
    background: hovered ? "rgb(79, 70, 229)" : "rgb(255, 255, 255)",
    color: hovered ? "rgb(255, 255, 255)" : "rgb(79, 70, 229)",
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
        Apply Now
      </button>
    </div>
  );
};

export default ApplyNow;
