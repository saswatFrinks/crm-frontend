import Button from '@/shared/ui/Button';
import Chip from '@/shared/ui/Chip';
import Drawer from '@/shared/ui/Drawer';
import React, { useEffect, useRef } from 'react';
import { FaPlus } from 'react-icons/fa';
import BuildNTrainDrawer from './BuildNTrainDrawer';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  augmentationsAtom,
  classAtom,
  configurationAtom,
  datasetAtom,
  defaultAugmentationAtom,
  defaultModelInfoAtom,
  // modelIdAtom,
  modelInfoAtom,
  stepAtom,
} from './state';
import { Link, useParams } from 'react-router-dom';
import axiosInstance from '@/core/request/aixosinstance';
import toast, { Toaster } from 'react-hot-toast';
import ProjectCreateLoader from '@/shared/ui/ProjectCreateLoader';
import RadialProgressBar from '../../assembly/components/RadialProgressBar';
import Tooltip from '../../assembly/components/Tooltip';

export const augmentationsMap = {
  HorizontalFlip: 'Horizontal Flip',
  VerticalFlip: 'Vertical Flip',
  Rotate: 'Rotation',
  GaussianBlur: 'Gaussian Blur',
  RandomCrop: 'Random Crop',
  RandomBrightnessContrast: 'Random Brightness Contrast',
};

// const trainingStatus = {
//   0: {name: 'Training Queued', color: 'text-gray-500'},
//   1: {name: 'Initiating Training', color: 'text-green-300'},
//   2: {name: 'Initiating Training', color: 'text-green-300'},
//   3: {name: 'Training Started', color: 'text-green-400'},
//   4: {name: 'Files Downloaded', color: 'text-orange-400'},
//   5: {name: 'Training The Model', color: 'text-orange-500'},
//   6: {name: 'Uploading File', color: 'text-orange-500'},
//   7: {name: 'Completed', color: 'text-green-500'},
//   8: {name: 'Error While Training', color: 'text-red-400'},
//   9: {name: 'Network Disconnection: Status Not Available', color: 'text-red-400' }
// }

const trainingStatus = {
  'TRAINING': [5],
  'PRETRAINING': [1,2,,3,4],
  'ERROR': [8,9, 28, 29],
  'QUEUED': [0]
}

const ERRORS = {
  8: 'Error During Training',
  9: 'Server Disconnected',
  28: 'Error During Evaluation',
  29: 'Server Disconnected'
}

const validationCompleteStatus = 27;

const actionDescriptions = [
  "Training queued. The training process will start soon.",
  "Initiating.",
  "Initiating.",
  "Downloading resources",
  "Training started",
  "Training the model",
  "Uploading model files",
  "Training process is complete",
  "Error while training the model",
  "Failed to fetch training status. Trying to reconnect"
]

actionDescriptions[validationCompleteStatus] = "Training and Evaluation Completed. Your AI model is ready";
actionDescriptions[validationCompleteStatus + 1] ="Failed to evaluate the AI model"
const validationMessage = "Validating the AI model"

export default function AIAssembly() {
  const params = useParams();
  const [open, setOpenDrawer] = React.useState(false);
  const [modelsList, setModelsList] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [step, setStep] = useRecoilState(stepAtom);
  // const setModelId = useSetRecoilState(modelIdAtom);
  const [configuration, setConfiguration] = useRecoilState(configurationAtom);
  // const classes = useRecoilState(classAtom);
  // const rois = useRecoilState();
  const [classAt, setClassAtom] = useRecoilState(classAtom);
  const [datasets, setDatasets] = useRecoilState(datasetAtom);
  const [augmentations, setAugmentations] = useRecoilState(augmentationsAtom);
  const [modelInfo, setModelInfo] = useRecoilState(modelInfoAtom);
  const [project, setProject] = React.useState(null);
  
  const formRefs = Array.from({length: 5}, () => useRef(null));
  const sseRef = useRef(null);

  const handleNext = async () => {
    try {
      const canProceed = await formRefs[step-1]?.current?.handleSubmit();
      setStep((t) => {
        if(formRefs[t-1]?.current && canProceed !== true)return t;
        if (t == 5) return t;
        return t + 1;
      });
    } catch (error) {
      toast.error(error?.message)
    }
  };

  const handleBack = () => {
    setStep((t) => {
      if (t == 1) return t;
      return t - 1;
    });
  };

  // const trainingStatus = {
  //   0: { label: 'Initiated', color: 'text-yellow-500' },
  //   1: { label: 'Files Downloaded', color: 'text-orange-500' },
  //   2: { label: 'Training', color: 'text-gray-500' },
  //   3: { label: 'Uploading', color: 'text-gray-500' },
  //   4: { label: 'Completed', color: 'text-green-500' },
  //   5: { label: 'Error', color: 'text-red-500' },
  // };

  const columns = [
    'Model Name',
    'Date Created',
    'Training Data',
    'Training Status',
    'Classes',
  ];

  const resetForm = () => {
    setConfiguration([]);
    setDatasets([]);
    setClassAtom([]);
    setAugmentations(defaultAugmentationAtom);
    setModelInfo(defaultModelInfoAtom);
  }

  const closeDrawer = () => {
    setOpenDrawer(false);
    resetForm();
    setStep(1);
  };

  const openDrawer = () => {
    setOpenDrawer(true);
  };

  const fetchModelsList = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/model/model-status', {
        params: {
          projectId: params.projectId,
        },
      });
      setLoading(false);
      setModelsList(res.data.data);
      sseRef.current?.close();
      startTrainingSSE();
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.data?.message);
    }
  };

  const fetchProject = async () => {
    try {
      const res = await axiosInstance.get('/project', {
        params: {
          projectId: params.projectId,
        },
      })
      setProject(res?.data?.data);
    } catch (error) {
      toast.error(error?.response?.data?.data?.message || 'Cannot fetch project details');
    }
  };

  useEffect(() => {
    fetchModelsList();
    fetchProject();
    return ()=> sseRef.current?.close();
  }, []);

  const startTrainingSSE = async () =>{
    console.log('Starting Training SSE');
    const sse = new EventSource(
      `${import.meta.env.VITE_BASE_API_URL}/model/detection/sse?projectId=${params.projectId}`,
      { withCredentials: true }
    );

    sse.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('[STATUS UPDATE]', data);
      setModelsList(prev=>{
        const cp = [...prev];
        let index = cp.findIndex(ele=> ele.jobId==data.jobId);
        if(index>=0){
          cp[index].status = data.status;
          if(data.epoch){
            let [n, d] = String(data.epoch).split('/')
            if(d){
              cp[index].info = {value: parseInt(n), max: parseInt(d)}
            }
          }
          else delete cp[index].info
        }
        return cp;
      })
    }

    sseRef.current = sse;
  }

  const startTraining = async () => {
    console.log('starting training', configuration);
    setLoading(true);
    try {
      const roiList = configuration
        .filter((configItem) => {
          return configItem.check;
        })
        .map((filteredConfigItem) => {
          return filteredConfigItem.roi.id;
        });
      const augmentationList = Object.keys(augmentations).filter((key) => {
        return augmentations[key];
      });
      const datasetList = [];
      datasets
        .filter((datasetItem) => {
          return datasetItem.check;
        })
        .map((datasetItem) => {
          datasetItem.folders
            .filter((folderItem) => {
              return folderItem.check;
            })
            .map((folderItem) => {
              datasetList.push(folderItem.id);
            });
        });
      const modelInfoObj = modelInfo;
      const data = {
        name: modelInfoObj.modelName,
        comment: modelInfoObj.modelDescription,
        rois: roiList,
        datasets: datasetList,
        augmentations: augmentationList,
      };
      console.log('data:', data);
      const resp = await axiosInstance.post('/model/detection', data);
      console.log('started training:', resp);
      setLoading(false);
      fetchModelsList();
      closeDrawer();
    } catch (error) {
      console.error('Got error:', error);
      fetchModelsList();
      setLoading(false);
      toast.error(error?.response?.data?.data?.message);
    }
  };

  return (
    <>
      {/* <Toaster> */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">AI Models</h1>
        <Button fullWidth={false} size="xs" onClick={openDrawer}>
          <div className="flex items-center gap-2">
            <FaPlus />
            Build & Train an AI Model
          </div>
        </Button>
      </div>

      <div className="placeholder:*: relative shadow-md sm:rounded-lg">
        {loading ? (
          <ProjectCreateLoader title="Loading..." />
        ) : (
          <table className="w-full text-left text-sm text-gray-500 rtl:text-right ">
            <thead className="bg-white text-sm uppercase text-gray-700 ">
              <tr>
                {columns.map((t, i) => (
                  <th scope="col" className={`px-6 py-3 ${i == 0 ? 'text-left' : (i === columns.length - 1 ? '' : 'text-center')}`} key={t}>
                    {t}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {modelsList?.length > 0 &&
                modelsList?.map((model) => {
                  const action = trainingStatus.QUEUED.includes(model.status) ? 0 : 
                    trainingStatus.PRETRAINING.includes(model.status) ? 1 :
                    trainingStatus.TRAINING.includes(model.status) ? 2 :
                    trainingStatus.ERROR.includes(model.status) ? 3:
                    model.status == validationCompleteStatus ? 5: 4
                  return (
                    <tr
                      className="border-b odd:bg-white even:bg-[#C6C4FF]/10"
                      key={model.id}
                    >
                      <th
                        scope="row"
                        className={`whitespace-nowrap px-6 py-4 text-left font-medium text-gray-900 ${model.status == validationCompleteStatus ? 'underline' : ''}`}
                      >
                        {model.status == validationCompleteStatus ?
                          <Link
                            to={`${model.id}#detail`}
                            // onClick={() => {
                            //   setModelId(model.id);
                            // }}
                          >
                            {model.name}
                          </Link>
                          :
                          model.name
                        }
                      </th>
                      <td className="px-6 py-4 text-center">
                        {new Date(Number(model.createdAt)).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {model.totalImages} image
                        {model.totalImages != 1 && 's'}
                      </td>
                      <td
                        className='px-6 py-3 text-center'
                      >
                        <Tooltip text={
                          actionDescriptions[model.status] || validationMessage
                        }>
                          {
                            action == 0 ? 'Training Queued' : 
                            action == 1 ?
                              <RadialProgressBar value={0} max={10} size={45} strokeWidth={4}/> :
                            action == 2?
                              <RadialProgressBar value={model.info?.value || 0} max={model.info?.max || 10} size={45} strokeWidth={4}/> :
                            action == 3? <span className='text-red-400'>{ERRORS[model.status]}</span> :
                              <RadialProgressBar value={10} max={10} size={45} strokeWidth={4} showMax/>
                          }
                        </Tooltip>
                      </td>
                      {/* <td
                        className={`px-6 py-4 ${trainingStatus[model.status]?.color || 'text-green-500'}`}
                      >
                        {trainingStatus[model.status]?.name || "Training Completed"}
                        {model.info && <p>{model.info}</p>}
                      </td>
                    */}
                      <td className="flex flex-wrap gap-2 px-6 py-4">
                        {model?.classes?.length > 0 &&
                          model.classes.map((item, index) => (
                            <Chip key={item.id} color={`color-${index + 1}`}>
                              {item.name}
                            </Chip>
                          ))}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        )}
      </div>

      <Drawer
        isOpen={open}
        handleClose={closeDrawer}
        title="Build and Train AI model"
        size="7xl"
        footer={
          <div className="grid w-full grid-cols-12">
            <div className="col-span-8 col-start-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {step > 1 && (
                  <Button
                    size="xs"
                    fullWidth={false}
                    variant="flat"
                    className="min-w-[150px]"
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                )}

                {step < 5 ? (
                  <Button
                    size="xs"
                    fullWidth={false}
                    className="min-w-[150px]"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    size="xs"
                    fullWidth={false}
                    onClick={() => {
                      startTraining();
                    }}
                    className="min-w-[150px]"
                  >
                    Start Training
                  </Button>
                )}
              </div>

              <Button
                size="xs"
                variant="flat"
                fullWidth={false}
                className="min-w-[150px]"
                onClick={closeDrawer}
              >
                Cancel
              </Button>
            </div>
          </div>
        }
      >
        {open && <BuildNTrainDrawer 
          formRefs = {formRefs}
          isMoving = {!project?.isItemFixed}
        />}
      </Drawer>
      {/* </Toaster> */}
    </>
  );
}
