import { atom } from 'recoil';

export const stepAtom = atom({
  key: 'stepAtomAi',
  default: 1,
});

export const defaultModelInfoAtom = { modelName: '', modelDescription: ''};

export const modelInfoAtom = atom({
  key: 'modelInfoAtom',
  default: defaultModelInfoAtom,
});

// export const modelIdAtom = atom({
//   key: 'modelIdAtom',
//   default: '',
// });

// export const modelSizeAtom = atom({
//   key: 'modelSizeAtom',
//   default: {
//     small: false,
//     medium: false,
//     large: false,
//   },
// });

export const defaultAugmentationAtom = {
  HorizontalFlip: false,
  VerticalFlip: false,
  Rotate: false,
  GaussianBlur: false,
  RandomCrop: false,
  // RandomBrightnessContrast: false,
}

export const augmentationsAtom = atom({
  key: 'augmentations',
  default: defaultAugmentationAtom,
});

export const configurationAtom = atom({
  key: 'configuration',
  default: [],
});

// export const modelIdAtom = atom({
//   key: 'details',
//   default: null,
// });

export const classAtom = atom({
  key: 'classes',
  default: [],
});

export const datasetAtom = atom({
  key: 'dataset',
  default: [],
});
