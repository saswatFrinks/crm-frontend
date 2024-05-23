import {
  DEFAULT_ASSEMBLY,
  DEFAULT_ROI,
  DEFAULT_STAGE,
  IMAGE_STATUS,
  POSITION,
  RECTANGLE_TYPE,
  STATUS,
} from '@/core/constants';
import { atom, selectorFamily } from 'recoil';

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
  default: DEFAULT_ASSEMBLY,
});

export const labelClassAtom = atom({
  key: 'labelClassAtom',
  default: null
})

export const annotationMapAtom = atom({
  key: 'annotationMapAtom',
  default: {}
})

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

export const imageDimensionAtom = atom({
  key: 'imageDimensionAtom',
  default: {height: 0, width: 0},
})

export const rectanglesTypeAtom = atom({
  key: 'rectanglesTypeAtom',
  default: RECTANGLE_TYPE.ROI
})

// export const editingRectAtom = atom({
//   key: 'editingRectAtom',
//   default: false,
// });

// export const stepAtom = atom({
//   key: 'stepAtom',
//   default: 0,
// });

export const uploadedFileListAtom = atom({
  key: 'uploadedFileListAtom',
  default: [],
});

export const selectedFileAtom = atom({
  key: 'selectedFileAtom',
  default: null,
});

export const selectedRoiSelector = selectorFamily({
  key: 'selectedRoiSelector',
  get:
    (imageId) =>
    ({ get }) => {
      return get(rectanglesAtom).filter((k) => k.imageId == imageId);
    },
});

export const lastActionNameAtom = atom({
  key: 'lastActionNameAtom',
  default: null,
})

export const annotationClassesAtom = atom({
  key: 'annotationClassesAtom',
  default: {}
})
