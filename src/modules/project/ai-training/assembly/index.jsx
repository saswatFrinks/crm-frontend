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

export const augmentationsMap = {
  HorizontalFlip: 'Horizontal Flip',
  VerticalFlip: 'Vertical Flip',
  Rotate: 'Rotation',
  GaussianBlur: 'Gaussian Blur',
  RandomCrop: 'Random Crop',
  RandomBrightnessContrast: 'Random Brightness Contrast',
};

const trainingStatus = {
  0: {name: 'Training Queued', color: 'text-gray-500'},
  1: {name: 'Initiating Training', color: 'text-green-300'},
  2: {name: 'Initiating Training', color: 'text-green-300'},
  3: {name: 'Training Started', color: 'text-green-400'},
  4: {name: 'Files Downloaded', color: 'text-orange-400'},
  5: {name: 'Training The Model', color: 'text-orange-500'},
  6: {name: 'Uploading File', color: 'text-orange-500'},
  7: {name: 'Completed', color: 'text-green-500'},
  8: {name: 'Error While Training', color: 'text-red-400'}
}

const totalStatusCount = Object.keys(trainingStatus).length;

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
      toast.error(JSON.stringify(error));
    }
  };

  useEffect(() => {
    fetchModelsList();
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
            cp[index]['info'] = `Epoch ${data.epoch}`
          }
          else if(cp[index].info) delete cp[index].info;
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
      const roiList = configuration[0]
        .filter((configItem) => {
          return configItem.check;
        })
        .map((filteredConfigItem) => {
          return filteredConfigItem.roi.id;
        });
      const augmentationList = Object.keys(augmentations[0]).filter((key) => {
        return augmentations[0][key];
      });
      const datasetList = [];
      datasets[0]
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
      const modelInfoObj = modelInfo[0];
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
                {columns.map((t) => (
                  <th scope="col" className="px-6 py-3" key={t}>
                    {t}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {modelsList?.length > 0 &&
                modelsList?.map((model) => {
                  return (
                    <tr
                      className="border-b odd:bg-white even:bg-[#C6C4FF]/10"
                      key={model.id}
                    >
                      <th
                        scope="row"
                        className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 hover:underline "
                      >
                        <Link
                          to={`${model.id}#detail`}
                          // onClick={() => {
                          //   setModelId(model.id);
                          // }}
                        >
                          {model.name}
                        </Link>
                      </th>
                      <td className="px-6 py-4">
                        {new Date(Number(model.createdAt)).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        {model.totalImages} image
                        {model.totalImages != 1 && 's'}
                      </td>
                      <td
                        className={`px-6 py-4 ${trainingStatus[model.status]?.color}`}
                      >
                        {trainingStatus[model.status]?.name}
                        {model.info && <p>{model.info}</p>}
                      </td>
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
        <BuildNTrainDrawer 
          formRefs = {formRefs}
        />
      </Drawer>
      {/* </Toaster> */}
    </>
  );
}
