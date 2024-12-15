import React, { useState } from "react";

export const generateRandomColor = () => {
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
  const [sizes, setSizes] = useState([50, 50]); // Default sizes of child boxes

  const handleSplit = (direction) => {
    setSplitDirection(direction);
    setChildren([
      { id: `${Date.now()}-1`, color: generateRandomColor() },
      { id: `${Date.now()}-2`, color: generateRandomColor() },
    ]);
    setSizes([50, 50]); // Reset sizes to 50% each
  };

  const handleRemove = () => {
    removeBox();
  };

  const handleResize = (index, delta) => {
    setSizes((prevSizes) => {
      const newSizes = [...prevSizes];
      const totalSize = 100;
      const adjustment = (delta / (splitDirection === "H" ? dimensions.width : dimensions.height)) * totalSize;

      newSizes[index] = Math.max(10, Math.min(totalSize - 10, newSizes[index] + adjustment));
      newSizes[1 - index] = totalSize - newSizes[index];

      return newSizes;
    });
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
        <div className="flex flex-col items-center justify-center w-full h-full">
          <button
            onClick={() => handleSplit("V")}
            className="bg-blue-500 text-white px-2 py-1 m-1 rounded"
          >
            V
          </button>
          <button
            onClick={() => handleSplit("H")}
            className="bg-green-500 text-white px-2 py-1 m-1 rounded"
          >
            H
          </button>
          <button
            onClick={handleRemove}
            className="bg-red-500 text-white px-2 py-1 m-1 rounded"
          >
            -
          </button>
        </div>
      ) : (
        children.map((child, index) => (
          <div
            key={child.id}
            style={{
              width: splitDirection === "H" ? `${sizes[index]}%` : "100%",
              height: splitDirection === "H" ? "100%" : `${sizes[index]}%`,
              position: "relative",
            }}
          >
            <Box
              color={child.color}
              dimensions={{
                width: splitDirection === "H" ? (dimensions.width * sizes[index]) / 100 : dimensions.width,
                height: splitDirection === "H" ? dimensions.height : (dimensions.height * sizes[index]) / 100,
              }}
              removeBox={() => {
                setChildren((prevChildren) => {
                  const newChildren = prevChildren.filter((_, i) => i !== index);
                  if (newChildren.length === 1) {
                    // Expand the remaining child to fill the parent space
                    setSplitDirection(null);
                    setSizes([100]);
                  }
                  return newChildren;
                });
              }}
            />
            {index === 0 && children.length === 2 && (
              <div
                onMouseDown={(e) => {
                  const start = splitDirection === "H" ? e.clientX : e.clientY;
                  const handleMouseMove = (event) => {
                    const current = splitDirection === "H" ? event.clientX : event.clientY;
                    const delta = current - start;
                    handleResize(0, delta);
                  };
                  const handleMouseUp = () => {
                    document.removeEventListener("mousemove", handleMouseMove);
                    document.removeEventListener("mouseup", handleMouseUp);
                  };
                  document.addEventListener("mousemove", handleMouseMove);
                  document.addEventListener("mouseup", handleMouseUp);
                  e.preventDefault();
                }}
                className="absolute bg-gray-400 cursor-pointer"
                style={{
                  top: splitDirection === "H" ? 0 : "calc(100% - 4px)",
                  left: splitDirection === "H" ? "calc(100% - 4px)" : 0,
                  width: splitDirection === "H" ? "4px" : "100%",
                  height: splitDirection === "H" ? "100%" : "4px",
                }}
              />
            )}
          </div>
        ))
      )}
    </div>
  );
};


export default Box;