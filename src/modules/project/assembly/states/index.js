import {
  DEFAULT_ROI,
  DEFAULT_STAGE,
  IMAGE_STATUS,
  POSITION,
  STATUS,
} from '@/core/constants';
import { atom } from 'recoil';

export const stageAtom = atom({
  key: 'stageAtom',
  default: DEFAULT_STAGE,
});

export const imageStatusAtom = atom({
  key: 'imageStatusAtom',
  default: IMAGE_STATUS,
});

export const imagePositionAtom = atom({
  key: 'imagePositionAtom',
  default: POSITION,
});

export const dragAtom = atom({
  key: 'dragAtom',
  default: POSITION,
});

export const actionStatusAtom = atom({
  key: 'actionStatusAtom',
  default: STATUS.DEFAULT,
});

export const editingAtom = atom({
  key: 'editingAtom',
  default: false,
});

export const assemblyAtom = atom({
  key: 'assemblyAtom',
  default: {
    productFlow: 'up',
    primaryObject: '',
    primaryObjectClass: '',
    rois: [DEFAULT_ROI],
  },
});

export const currentRoiIdAtom = atom({
  key: 'currentRoiId',
  default: null,
});

export const currentRectangleIdAtom = atom({
  key: 'currentRectangleIdAtom',
  default: null,
});

export const mousePositionAtom = atom({
  key: 'mousePositionAtom',
  default: POSITION,
});

export const rectanglesAtom = atom({
  key: 'rectanglesAtom',
  default: [],
  dangerouslyAllowMutability: true,
});

export const editingRectAtom = atom({
  key: 'editingRectAtom',
  default: false,
});
