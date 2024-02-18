const PREFIX = 'Frinks';

export const TOKEN = `${PREFIX}_TOKEN`;

export const ASSEMBLY_CONFIG = {
  MOVING: 'moving',
  STATIONARY: 'stationary',
};

export const DEFAULT_STAGE = {
  scale: 1,
  x: 0,
  y: 0,
};

export const SCALE_RANGE = {
  MIN: 0.5,
  MAX: 20,
};

export const IMAGE_STATUS = {
  draw: false,
  dragging: false,
  drag: false,
};

export const POSITION = {
  x: 0,
  y: 0,
};

export const STATUS = {
  DRAW: 'draw',
  DISABLE: 'disable',
  EDITING: 'editing',
  FINISH: 'finish',
  DEFAULT: 'default',
};

export const DEFAULT_OBJECT = {
  id: 1,
  objectName: '',
  class: '',
  operation: '',
  qty: '',
  classify: false,
  checked: false,
  open: true
};

export const DEFAULT_ROI = {
  id: 2,
  checked: false,
  status: STATUS.DEFAULT,
  open: true,
  objects: [DEFAULT_OBJECT],
};
