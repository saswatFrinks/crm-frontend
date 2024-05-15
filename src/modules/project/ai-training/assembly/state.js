import { atom } from 'recoil';

export const stepAtom = atom({
  key: 'stepAtomAi',
  default: 1,
});

export const modelInfoAtom = atom({
  key: 'modelInfoAtom',
  default: { modelName: '', modelDescription: '', modelKey: 0 },
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
