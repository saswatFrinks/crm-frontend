import { getRandomHexColor } from '@/util/util';
import { atom } from 'recoil';

// export const stageAtom = atom({
//   key: 'stageAtom',
//   default: DEFAULT_STAGE,
// });

// export const imageStatusAtom = atom({
//   key: 'imageStatusAtom',
//   default: IMAGE_STATUS,
// });

// export const imagePositionAtom = atom({
//   key: 'imagePositionAtom',
//   default: POSITION,
// });

// export const dragAtom = atom({
//   key: 'dragAtom',
//   default: POSITION,
// });

// export const actionStatusAtom = atom({
//   key: 'actionStatusAtom',
//   default: STATUS.DEFAULT,
// });

// export const editingAtom = atom({
//   key: 'editingAtom',
//   default: false,
// });

// export const assemblyAtom = atom({
//   key: 'assemblyAtom',
//   default: {
//     productFlow: 'up',
//     primaryObject: '',
//     primaryObjectClass: '',
//     rois: [DEFAULT_ROI],
//   },
// });

// export const currentRoiIdAtom = atom({
//   key: 'currentRoiId',
//   default: null,
// });

// export const currentRectangleIdAtom = atom({
//   key: 'currentRectangleIdAtom',
//   default: null,
// });

// export const mousePositionAtom = atom({
//   key: 'mousePositionAtom',
//   default: POSITION,
// });

// export const rectanglesAtom = atom({
//   key: 'rectanglesAtom',
//   default: [],
//   dangerouslyAllowMutability: true,
// });

export const editingRectAtom = atom({
  key: 'editingRectAtom',
  default: false,
});

export const editingPolyAtom = atom({
  key: 'editingPolyAtom', 
  default: false
})

export const stepAtom = atom({
  key: 'stepAtom',
  default: 0,
});

// export const uploadedFileListAtom = atom({
//   key: 'uploadedFileListAtom',
//   default: [],
// });

// export const selectedFileAtom = atom({
//   key: 'selectedFileAtom',
//   default: null,
// });

// export const selectedRoiSelector = selectorFamily({
//   key: 'selectedRoiSelector',
//   get:
//     (imageId) =>
//     ({ get }) => {
//       console.log(get(rectanglesAtom));
//       return get(rectanglesAtom).filter((k) => k.imageId == imageId);
//     },
// });

export const loadedLabelsAtom = atom({
  key: 'loadedLabelsAtom',
  default: Array.from({ length: 10 }, () => false),
});

export const rectangleColorAtom = atom({
  key: 'rectangleColorAtom',
  default: {
    all: [],
    selectedColor: getRandomHexColor(),
  },
});

export const initialLabelsAtom = atom({
  key: 'initialLabelsAtom',
  default: [],
});

export const prevStatusAtom = atom({
  key: 'prevStatusAtom',
  default: 'default',
});

export const statusCheckAtom = atom({
  key: "statusCheckAtom",
  default: false,
})

export const captureAtom = atom({
  key: "captureAtom",
  default: null
})
