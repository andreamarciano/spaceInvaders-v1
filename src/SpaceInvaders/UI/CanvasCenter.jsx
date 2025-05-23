const CanvasCenter = ({ canvasSize }) => {
  return (
    <>
      {/* Horizontal Line */}
      <div
        className="absolute"
        style={{
          top: `${canvasSize.height / 2}px`,
          left: 0,
          width: "100%",
          borderTop: "2px solid red",
        }}
      />
      {/* Vertical Line */}
      <div
        className="absolute"
        style={{
          top: 0,
          left: `${canvasSize.width / 2}px`,
          height: "100%",
          borderLeft: "2px solid red",
        }}
      />
    </>
  );
};

export default CanvasCenter;
