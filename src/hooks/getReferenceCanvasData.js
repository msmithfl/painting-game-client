export const getReferenceCanvasData = (selectedPainting) => {
    return new Promise((resolve, reject) => {
      const referenceCanvas = document.createElement('canvas');
      const referenceContext = referenceCanvas.getContext('2d');
      referenceCanvas.width = selectedPainting.dimensions.width;
      referenceCanvas.height = selectedPainting.dimensions.height;
  
      const img = new Image();
      img.crossOrigin = 'Anonymous';
  
      img.onload = () => {
        referenceContext.drawImage(img, 0, 0);
        const referenceImageData = referenceContext.getImageData(
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
  
        resolve(rgbValues1);
      };
  
      img.onerror = (error) => {
        reject(error);
      };
  
      img.src = selectedPainting.path;
    });
  };
  