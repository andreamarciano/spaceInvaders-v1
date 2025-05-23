import { useState } from "react";

export default function ControlsPopup() {
  const [showControls, setShowControls] = useState(false);

  const Key = ({
    label,
    highlight = false,
    wide = false,
    halfHeight = false,
    tinyText = false,
  }) => {
    const base = "text-sm text-center border rounded bg-gray-200";
    const highlightStyle = highlight
      ? "bg-yellow-300 border-yellow-500 text-black font-bold"
      : "text-gray-700";
    const size = wide ? "w-27 h-6" : halfHeight ? "w-6 h-3" : "w-6 h-6";
    const textSize = tinyText ? "text-[11px]" : "text-xs";

    return (
      <div
        className={`${base} ${highlightStyle} ${size} ${textSize} flex items-center justify-center`}
      >
        {label}
      </div>
    );
  };

  return (
    <>
      <button
        onClick={() => setShowControls((prev) => !prev)}
        className="absolute top-2 right-20 bg-gray-200 hover:bg-gray-300 px-1 rounded cursor-pointer"
      >
        🎮
      </button>
      {showControls && (
        <div className="absolute top-12 right-24 bg-white shadow-xl p-2 rounded border border-gray-300 z-50 text-black w-[350px]">
          <h3 className="text-lg font-bold mb-4 text-center">
            Keyboard Controls
          </h3>

          <div className="flex flex-col gap-2">
            <div className="flex gap-1 justify-center">
              {"1234567890".split("").map((char) => (
                <Key key={char} label={char} />
              ))}
            </div>

            <div className="flex gap-1 justify-center ml-4">
              {"qwertyuiop".split("").map((char) => (
                <Key key={char} label={char} />
              ))}
            </div>

            <div className="flex gap-1 justify-center">
              {"asdfghjkl".split("").map((char) => (
                <Key
                  key={char}
                  label={char}
                  highlight={["a", "d"].includes(char)}
                />
              ))}
            </div>

            <div className="flex gap-1 justify-center mr-10">
              {"zxcvbnm".split("").map((char) => (
                <Key key={char} label={char} />
              ))}
            </div>

            <div className="flex justify-between items-center mt-2">
              <div className="flex gap-1 ml-25">
                <Key label="" wide highlight />
              </div>
              <div className="flex gap-1 mr-4">
                <Key label="<" highlight />
                <div className="flex flex-col gap-0.5">
                  <Key label="˄" halfHeight tinyText />
                  <Key label="˅" halfHeight tinyText />
                </div>
                <Key label=">" highlight />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center mt-1">
            <p className=" text-center text-sm text-gray-600">
              Use arrows to move, space to shoot.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
