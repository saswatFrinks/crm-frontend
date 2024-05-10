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
  drawing: false,
  dragging: false,
  drag: false,
  oneToOne: false,
  fitToCenter: false,
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
  className: '',
  operation: 0,
  qty: '',
  classify: false,
  checked: false,
  open: true,
};

export const DEFAULT_ROI = {
  id: 0,
  checked: false,
  status: STATUS.DEFAULT,
  open: true,
  parts: [DEFAULT_OBJECT],
};

export const OPERATIONS = [
  {
    id: 0,
    name: '=',
  },
  {
    id: 1,
    name: '<',
  },
  {
    id: 2,
    name: '>',
  },
];

export const BASE_RECT = {
  id: null,
  roiId: null,
  width: 0,
  height: 0,
  // type: RECT,
  strokeWidth: 0.5,
};

export const ASSEMBLY_STEPS = [
  'Upload Images',
  'Inspection Parameters',
  'Label Images',
  'Pre-training analysis',
];

export const RECTANGLE_TYPE = {
  ANNOTATION_LABEL: 'ANNOTATION_LABEL',
  ROI: 'ROI',
};
