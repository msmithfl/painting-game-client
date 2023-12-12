export const getPlayerCanvasData = (ctx, selectedPainting) => {
  if (ctx == null) {
    return;
  }
    const imageData = ctx.getImageData(0, 0, selectedPainting.dimensions.width, selectedPainting.dimensions.height);
    const data = imageData.data;
    const rgbValues = [];
    
    for (let i = 0; i < data.length; i += 4) {
      const red = data[i];
      const green = data[i + 1];
      const blue = data[i + 2];
      //const alpha = data[i + 3];

      // Push the RGB values into the array
      rgbValues.push([red, green, blue]);
    }

    return rgbValues;
};