import { DEFAULT_STAGE } from '@/core/constants';
import { atom } from 'recoil';

export const stageAtom = atom({
  key: 'stageAtom',
  default: DEFAULT_STAGE,
});
