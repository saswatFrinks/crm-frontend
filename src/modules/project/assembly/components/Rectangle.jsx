import React from 'react';
import { Rect, Transformer } from 'react-konva';
import PropTypes from 'prop-types';

const Rectangle = ({
  selectedReactangleId,
  shapeProps,
  isSelected,
  // onSelect,
  onChange,
  ...rest
}) => {
  const shapeRef = React.useRef();
  const trRef = React.useRef();

  React.useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <Rect
        // onClick={onSelect}
        // onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable={Boolean(selectedReactangleId)}
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          // transformer is changing scale of the node
          // and NOT its width or height
          // but in the store we have only width and height
          // to match the data better we will reset scale on transform end
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // we will reset it back
          node.scaleX(1);
          node.scaleY(1);

          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            // set minimal value
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          });
        }}
        {...rest}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

Rectangle.propTypes = {
  shapeProps: PropTypes.object.isRequired,
  isSelected: PropTypes.bool,
  onSelect: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  selectedReactangleId: PropTypes.string,
};

export default Rectangle;
