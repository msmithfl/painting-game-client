import React, { useState, useRef, useEffect } from "react";
import paintings from "./paintings.json";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';

function GameCanvas({selectedPainting}) {
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState(`rgba(${selectedPainting.colors.primaryColor}, 0.5)`);
  const [currentBrushSize, setCurrentBrushSize] = useState("20");
  const [selectedColorButton, setSelectedColorButton] = useState(selectedPainting.colors.primaryColor);
  const [selectedBrushButton, setSelectedBrushButton] = useState("button3");
  const [showImage, setShowImage] = useState(true);
  const [initialImageDisplay, setInitialImageDisplay] = useState(true);
  const [countdown5, setCountdown5] = useState(5);


  // setting up the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    setCtx(context);
  }, []);

  const setColor = (color, button) => {
    setCurrentColor(color);
    setSelectedColorButton(button);
  };

  const setBrushSize = (size, button) => {
    setCurrentBrushSize(size);
    setSelectedBrushButton(button);
  };

  const draw = (e) => {
    if (!drawing) return;

    ctx.lineWidth = currentBrushSize;
    ctx.lineCap = "butt";
    ctx.strokeStyle = currentColor;

    ctx.lineTo(
      e.clientX - canvasRef.current.getBoundingClientRect().left,
      e.clientY - canvasRef.current.getBoundingClientRect().top
    );
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(
      e.clientX - canvasRef.current.getBoundingClientRect().left,
      e.clientY - canvasRef.current.getBoundingClientRect().top
    );
  };

  const clearCanvas = () => {
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const toggleImage = () => {
    setShowImage(!showImage);
  };

  // useEffect(() => {
  //   const delay = 5000;

  //   const timeoutId = setTimeout(() => {
  //     toggleImage();
  //     setInitialImageDisplay(false);
  //   }, delay);

  //   // Clear the timeout if the component unmounts or if you want to cancel the delay for some reason
  //   return () => clearTimeout(timeoutId);
  // }, []);

  useEffect(() => {
    if (countdown5 > 0) {
      const timer5 = setTimeout(() => {
        setCountdown5(countdown5 - 1);
      }, 1000);

      return () => clearTimeout(timer5);
    }

    // when the 5-second countdown finishes
    if (countdown5 === 0) {
      toggleImage();
      setInitialImageDisplay(false);
      console.log('5-second countdown finished!');
    }
  }, [countdown5]);

  return (
    <div className="flex flex-col items-center space-y-2">
      <button
        className={`${showImage ? "border-2 border-white" : ""}`}
        onClick={toggleImage}
        disabled={initialImageDisplay}
      >
        <FontAwesomeIcon icon={faImage}/>
      </button>
      <div style={{ position: 'relative' }}>
        {showImage && (
          <img
            onPointerDown={() => {
              if (initialImageDisplay) {return};
              setDrawing(true);
              toggleImage();
            }}
            src={`${selectedPainting.path}`}
            alt="Reference Image"
            style={{ position: 'absolute', top: 0, left: 0, width: '360px', zIndex: 1, touchAction: 'none' }}
          />
        )}
        <canvas
          className=" bg-white"
          style={{ touchAction: 'none' }} // gets rid of scrolling on mobile
          id="drawing-canvas"
          ref={canvasRef}
          width={selectedPainting.dimensions.width}
          height={selectedPainting.dimensions.height}
          onPointerDown={(e) => {
            //e.preventDefault(); // Prevent default pointer behavior, if needed add to the other onPointer functions
            setDrawing(true);
          }}
          onPointerUp={(e) => {
            setDrawing(false);
            ctx.beginPath();
          }}
          onPointerMove={(e) => {
            draw(e);
          }}
        />
        {countdown5 > 0 && (
          <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
        >
          <span className="text-5xl font-bold text-black">{countdown5}</span>
        </div>
         )}
      </div>
      <div className="flex gap-3">
        <div>
          {/* <button
            className={`${selectedColorButton === "button1" ? "border-2 border-white" : ""}`}
            style={{ backgroundColor: `rgb(${paintings.alba.colors.primaryColor})` }}
            onClick={() => {
              setColor(`rgba(${paintings.alba.colors.primaryColor}, 0.5`, "button1")
            }}
          ></button>
          <button
            className={`${selectedColorButton === "button2" ? "border-2 border-white" : ""}`}
            style={{ backgroundColor: `rgb(${paintings.alba.colors.colorTwo})` }}
            onClick={() => {
              setColor(`rgba(${paintings.alba.colors.colorTwo}, 0.5`, "button2")
            }}
          ></button> */}
          {Object.values(selectedPainting.colors).map((color) => (
            <button
              key={color}
              className={`${selectedColorButton === color ? "border-2 border-white" : ""}`}
              style={{ backgroundColor: `rgb(${color})` }}
              onClick={() => {
                setColor(`rgba(${color}, 0.5`, color)
              }}
            ></button>
          ))}
        </div>
        <div>
          <button
            className={`${selectedBrushButton === "button1" ? "border-2 border-white" : ""}`}
            onClick={() => {
              setBrushSize("2", "button1")
            }}
          >SM</button>
          <button
            className={`${selectedBrushButton === "button2" ? "border-2 border-white" : ""}`}
            onClick={() => {
              setBrushSize("10", "button2")
            }}
          >MD</button>
          <button
            className={`${selectedBrushButton === "button3" ? "border-2 border-white" : ""}`}
            onClick={() => {
              setBrushSize("20", "button3")
            }}
          >LG</button>
        </div>
      </div>
      {/* <button id="clear-button" onClick={clearCanvas}>
        Clear Canvas
      </button> */}
    </div>
  );
};

export default GameCanvas;
