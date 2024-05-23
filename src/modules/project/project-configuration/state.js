import { atom } from 'recoil';

export const selectedConfigurationAtom = atom({
  key: 'selectedConfiguration',
  default: {
    id: '',
    objective: 'Assembly',
    status: ''
  },
});

export const classOptionsAtom = atom({
  key: 'classesOptions',
  default: [],
});
