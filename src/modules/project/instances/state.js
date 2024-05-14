import { atom } from 'recoil';

export const addInstanceAtom = atom({
  key: 'addInstanceBasicAtom',
  default: {
    instanceId: null,
    mappingData: null,
    basic: {
      instanceName: '',
      plantId: '',
      cameraIps: [],
      plantName: ''
    },
    mapCameraIp: {
      data: {},
      cameraIps: []
    },
    modelSelection: {
      modelRoiMap: null
    },
    colorClasses: null
  }
});
