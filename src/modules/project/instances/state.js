import { atom } from 'recoil';

export const defaultAddInstanceValue = {
  instanceId: null,
  mappingData: null,
  basic: {
    instanceName: '',
    plantId: '',
    cameraIps: [],
    plantName: '',
    teamId: '',
    teamName: ''
  },
  mapCameraIp: {
    data: {},
    cameraIps: []
  },
  cameraConfig: {
    files: null
  },
  modelSelection: {
    modelRoiMap: null,
    primaryRoiMap: null
  },
  colorClasses: null
}

export const addInstanceAtom = atom({
  key: 'addInstanceBasicAtom',
  default: defaultAddInstanceValue
});

export const downloadInstanceProgressAtom = atom({
  key: 'downloadInstaceProgressAtom',
  default: {
    instanceId: null,
    progress: 0
  }
})
