import { atom } from 'recoil';

export const selectedConfigurationAtom = atom({
  key: 'selectedConfiguration',
  default: {
    id: '',
    objective: 'Assembly',
    status: '',
    analysisStatus: ''
  },
});

export const classOptionsAtom = atom({
  key: 'classesOptions',
  default: [],
});
