import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faClock } from '@fortawesome/free-solid-svg-icons';
import { deltaE } from "./hooks/comparePixels";
import { getReferenceCanvasData } from "./hooks/getReferenceCanvasData";
import { getPlayerCanvasData } from "./hooks/getPlayerCanvasData";

function GameCanvas({selectedPainting, timer, score, gameOver, handleScoreSubmit}) {
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
  //const [refPixelData, setRefPixelData] = useState();
  //const [finalScore, setFinalScore] = useState(0);
  const [refPixelValues, setRefPixelValues] = useState([]);

  // setting up the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    setCtx(context);
  
    //getting ref pixel data
    const img = new Image();
    img.onload = () => {
      context.drawImage(img, 0, 0, selectedPainting.dimensions.width, selectedPainting.dimensions.height);
      
      setTimeout(() => {
        const referenceImageData = context.getImageData(
          0,
          0,
          selectedPainting.dimensions.width,
          selectedPainting.dimensions.height
        );
  
        const referenceData = referenceImageData.data;
  
        const rgbValues1 = [];
        for (let i = 0; i < referenceData.length; i += 4) {
          const red = referenceData[i];
          const green = referenceData[i + 1];
          const blue = referenceData[i + 2];
          rgbValues1.push([red, green, blue]);
        }
        setRefPixelValues(rgbValues1);
  
        // Clearing the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
      }, 1000);
    };
    img.src = selectedPainting.path;
  }, []);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("Game Over");
      handleGetDeltaE();
      //handleScoreSubmit(finalScore);
    }, 200); // 0.2 seconds in milliseconds
  
    return () => clearTimeout(timer);
  }, [gameOver]);

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
      const refData = getReferenceCanvasData(selectedPainting);
      console.log("Reference Data");
      console.log(refData);
      setRefPixelData(refData);
    } catch (error) {
      console.error('Error fetching reference data:', error);
    }
  };

  const handleGetDeltaE = () => {
    // console.log("Ref Canvas Data:")
    // console.log(refPixelValues);

    const playerCanvasData = getPlayerCanvasData(ctx, selectedPainting);
    // console.log("Player Canvas Data:");
    // console.log(playerCanvasData);

    const deltaEValues = [];

    let isCanvasBlank = true;
    const blankArray = [0, 0, 0];

    for (let i = 0; i < refPixelValues.length; i++) {
      // checks if canvas is blank/all white
      if (playerCanvasData[i].toString() !== blankArray.toString()) {
        isCanvasBlank = false;
      }
      deltaE(refPixelValues[i], playerCanvasData[i]); 

      // Push the RGB values into the array
      deltaEValues.push(deltaE(refPixelValues[i], playerCanvasData[i]));
    }
    console.log("Is Canvas Blank?");
    console.log(isCanvasBlank);

    //console.log("Delta E Values:");
    //console.log(deltaEValues);

    let totalDeltaE = 0;

    for (let i = 0; i < deltaEValues.length; i++) {
      totalDeltaE += deltaEValues[i];
    }

    const avgDeltaE = (totalDeltaE / deltaEValues.length).toFixed(1);

    //sending final score
    handleScoreSubmit(100 - avgDeltaE);

    // final score
    console.log(100 - avgDeltaE);
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
        {/* <div>
          <h2 className=" text-3xl">{score}%</h2>
        </div> */}
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
      {/* <div  className="flex gap-3 items-center">
        <button className="p-3" onClick={handleGetCanvasData}>Get Canvas Data</button>
        <button className="p-3" onClick={handleGetReferenceData}>Get Ref Data</button>
        <button className="p-3" onClick={handleGetDeltaE}>Get Delta E</button>
      </div> */}
    </div>
  );
};

export default GameCanvas;
