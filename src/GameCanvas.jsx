import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faClock } from '@fortawesome/free-solid-svg-icons';
import { deltaE } from "./hooks/comparePixels";
import { getReferenceCanvasData } from "./hooks/getReferenceCanvasData";
import { getPlayerCanvasData } from "./hooks/getPlayerCanvasData";

function GameCanvas({selectedPainting, timer, score}) {
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
  const [refPixelData, setRefPixelData] = useState();

  // setting up the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    setCtx(context);

    handleGetReferenceData();
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

  // initial 5-second timer
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
    }
  }, [countdown5]);

  const handleGetCanvasData = () => {
    const playerCanvasData = getPlayerCanvasData(ctx, selectedPainting);
    console.log("Player Canvas Data:");
    console.log(playerCanvasData);
  }

  const handleGetReferenceData = async () => {
    try {
      const refData = await getReferenceCanvasData(selectedPainting);
      setRefPixelData(refData);
    } catch (error) {
      console.error('Error fetching reference data:', error);
    }
  };

  const handleGetDeltaE = () => {
    //console.log("Ref Canvas Data:")
    //console.log(refPixelData);

    const playerCanvasData = getPlayerCanvasData(ctx, selectedPainting);
    //console.log("Player Canvas Data:");
    //console.log(playerCanvasData);

    const deltaEValues = [];

    for (let i = 0; i < refPixelData.length; i++) {
      deltaE(refPixelData[i], playerCanvasData[i]); 

      // Push the RGB values into the array
      deltaEValues.push(deltaE(refPixelData[i], playerCanvasData[i]));
    }
    console.log("Delta E Values:")
    console.log(deltaEValues);
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="flex items-center gap-6">
        <div className="flex gap-2 items-center">
          <FontAwesomeIcon icon={faClock}/>
          <h2 className='text-3xl'>{timer > 60 ? 60 : timer}</h2>
        </div>
        <button
          className={`rounded-md px-3 py-1 border-4 ${showImage ? "border-white" : "border-transparent"}`}
          onClick={toggleImage}
          disabled={initialImageDisplay}
        >
          <FontAwesomeIcon icon={faImage}/>
        </button>
        <div>
          <h2 className=" text-3xl">{score}%</h2>
        </div>
      </div>
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
          className="bg-white drop-shadow-lg"
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
          <span className="text-5xl font-bold text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">{countdown5}</span>
        </div>
         )}
      </div>
      <div className="flex gap-3 items-center">
            <div>
              <button
                className={`rounded-md py-2 w-9 border-4 transform transition-transform font-bold ${selectedBrushButton === 'button1' ? 'border-white translate-y-[-3px]' : 'border-transparent'}`}
                onClick={() => {
                  setBrushSize("2", "button1")
                }}
              >SM</button>
              <button
                className={`rounded-md py-2 w-9 border-4 transform transition-transform font-bold ${selectedBrushButton === 'button2' ? 'border-white translate-y-[-3px]' : 'border-transparent'}`}
                onClick={() => {
                  setBrushSize("10", "button2")
                }}
              >MD</button>
              <button
                className={`rounded-md py-2 w-9 border-4 transform transition-transform font-bold ${selectedBrushButton === 'button3' ? 'border-white translate-y-[-3px]' : 'border-transparent'}`}
                onClick={() => {
                  setBrushSize("20", "button3")
                }}
              >LG</button>
            </div>
        <div>
          {Object.values(selectedPainting.colors).map((color) => (
            <button
              key={color}
              className={`h-12 w-7 rounded-md border-4 transform transition-transform ${selectedColorButton === color ? 'border-white translate-y-[-3px]' : 'border-transparent'}`}
              style={{ backgroundColor: `rgb(${color})` }}
              onClick={() => {
                setColor(`rgba(${color}, 0.5`, color)
              }}
            ></button>
          ))}
        </div>
      </div>
      {/* <button id="clear-button" onClick={clearCanvas}>
        Clear Canvas
      </button> */}
      <div  className="flex gap-3 items-center">
        <button className="p-3" onClick={handleGetCanvasData}>Get Canvas Data</button>
        <button className="p-3" onClick={() => console.log(refPixelData)}>Get Ref Data</button>
        <button className="p-3" onClick={handleGetDeltaE}>Get Delta E</button>
      </div>
    </div>
  );
};

export default GameCanvas;
