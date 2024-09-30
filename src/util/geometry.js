export const cropLine = ({ x1, y1, x2, y2, boundaryX, boundaryY }) => {
  // Check if the line is completely outside the rectangle
  if (
    (x1 < 0 && x2 < 0) ||
    (y1 < 0 && y2 < 0) ||
    (x1 > boundaryX && x2 > boundaryX) ||
    (y1 > boundaryY && y2 > boundaryY)
  ) {
    return null;
  }

  if (
    x1 >= 0 &&
    x1 <= boundaryX &&
    y1 >= 0 &&
    y1 <= boundaryY &&
    x2 >= 0 &&
    x2 <= boundaryX &&
    y2 >= 0 &&
    y2 <= boundaryY
  ) {
    return { x1, y1, x2, y2 };
  }

  x1 = Math.max(Math.min(boundaryX, x1), 0);
  x2 = Math.max(Math.min(boundaryX, x2), 0);

  y1 = Math.max(Math.min(boundaryY, y1), 0);
  y2 = Math.max(Math.min(boundaryY, y2), 0);

  return { x1, y1, x2, y2 };
};

export const isPolygonInsideBoundary = (points, boundaryX, boundaryY) => {
  for (let i = 0; i < points.length; i += 2) {
    const x = points[i];
    const y = points[i + 1];

    // Check if the point is inside the boundary
    if (x >= 0 && x <= boundaryX && y >= 0 && y <= boundaryY) {
      return true;
    }
  }
  return false;
};

export const snapPolygonToBoundary = (points, boundaryX, boundaryY) => {
  const isOutsideBoundary = !isPolygonInsideBoundary(
    points,
    boundaryX,
    boundaryY
  );

  console.log('isOutside', isOutsideBoundary)

  if (isOutsideBoundary) {
    // Find the minimum and maximum x and y coordinates
    let minX = boundaryX;
    let maxX = 0;
    let minY = boundaryY;
    let maxY = 0;

    for (let i = 0; i < points.length; i += 2) {
      const x = points[i];
      const y = points[i + 1];

      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }

    // Calculate the translation amounts
    const translateX =
      minX < 0 ? -minX : maxX > boundaryX ? boundaryX - maxX : 0;
    const translateY =
      minY < 0 ? -minY : maxY > boundaryY ? boundaryY - maxY : 0;

      console.log({translateX, translateY})

    // Translate the points to snap the polygon into the boundary
    const snappedPoints = points.map((coord, index) => {
      return index % 2 === 0 ? coord + translateX : coord + translateY;
    });

    return snappedPoints;
  }

  return points;
};

export const scalePolygons = (arr, width, height)=>{
  return arr?.map((point, i) =>
    i % 2 == 0 ? point * width : point * height
  );
}

export const scaledownPolygons = (points, width, height)=>{
  return points.map((point, i)=>i % 2 == 0 ? point / width : point / height)
}
