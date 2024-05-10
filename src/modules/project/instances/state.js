import { atom } from 'recoil';

export const addInstanceAtom = atom({
  key: 'addInstanceBasicAtom',
  default: {
    basic: {
      instanceName: '',
      plantId: '',
      cameraIps: [],
      formikRef: null
    },
    mapCameraIp: {
      data: {},
      cameraIps: []
    }
  }
});
