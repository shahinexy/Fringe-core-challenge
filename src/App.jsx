import React, { useState } from "react";

const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const Box = ({ removeBox, color, dimensions }) => {
  const [children, setChildren] = useState([]);
  const [splitDirection, setSplitDirection] = useState(null);

  const handleSplit = (direction) => {
    setSplitDirection(direction);
    setChildren([
      { id: `${Date.now()}-1`, color: generateRandomColor() },
      { id: `${Date.now()}-2`, color: generateRandomColor() },
    ]);
  };

  const handleRemove = () => {
    removeBox();
  };

  return (
    <div
      className={`border-2 border-black flex ${
        splitDirection === "H" ? "flex-row" : "flex-col"
      }`}
      style={{
        backgroundColor: color,
        width: dimensions?.width || "100%",
        height: dimensions?.height || "100vh",
      }}
    >
      {children.length === 0 ? (
        <div className="flex items-center justify-center w-full h-full">
          <button
            onClick={() => handleSplit("V")}
            className="bg-blue-500 text-white px-2 py-1 rounded"
          >
            V
          </button>
          <button
            onClick={() => handleSplit("H")}
            className="bg-green-500 text-white px-2 py-1 rounded"
          >
            H
          </button>
          <button
            onClick={handleRemove}
            className="bg-red-500 text-white px-2 py-1 rounded"
          >
            -
          </button>
        </div>
      ) : (
        children.map((child, index) => (
          <Box
            key={child.id}
            color={child.color}
            dimensions={{
              width: children.length === 1 ? "100%" : splitDirection === "H" ? "50%" : "100%",
              height: children.length === 1 ? "100%" : splitDirection === "H" ? "100%" : "50%",
            }}
            removeBox={() => {
              setChildren((prevChildren) => {
                const newChildren = prevChildren.filter((_, i) => i !== index);
                if (newChildren.length === 1) {
                  // Expand the remaining child to fill the parent space
                  setSplitDirection(null);
                }
                return newChildren;
              });
            }}
          />
        ))
      )}
    </div>
  );
};


export default Box;