import { atom } from 'recoil';

export const selectedConfigurationAtom = atom({
  key: 'selectedConfiguration',
  default: {
    id: '',
    objective: 'Assembly',
  },
});

export const classOptionsAtom = atom({
  key: 'classes',
  default: [],
});
