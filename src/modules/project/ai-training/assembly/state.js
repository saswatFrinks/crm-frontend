import { atom } from 'recoil';

export const stepAtom = atom({
  key: 'stepAtomAi',
  default: 1,
});

export const modelInfoAtom = atom({
  key: 'modelInfoAtom',
  default: {},
});

export const modelSizeAtom = atom({
  key: 'modelSizeAtom',
  default: {
    small: false,
    medium: false,
    large: false,
  },
});

export const augmentationsAtom = atom({
  key: 'augmentations',
  default: {
    horizontal: false,
    vertical: false,
    rotation: false,
    noise: false,
  },
});

export const configurationAtom = atom({
  key: 'configuration',
  default: []
})

export const classAtom = atom({
  key: 'classes',
  default: []
})

export const datasetAtom = atom({
  key: 'dataset',
  default: []
})