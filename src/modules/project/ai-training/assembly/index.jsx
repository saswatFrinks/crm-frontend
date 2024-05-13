import Button from '@/shared/ui/Button';
import Chip from '@/shared/ui/Chip';
import Drawer from '@/shared/ui/Drawer';
import React, { useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import BuildNTrainDrawer from './BuildNTrainDrawer';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  augmentationsAtom,
  classAtom,
  configurationAtom,
  datasetAtom,
  // modelIdAtom,
  modelInfoAtom,
  stepAtom,
} from './state';
import { Link, useParams } from 'react-router-dom';
import axiosInstance from '@/core/request/aixosinstance';
import toast, { Toaster } from 'react-hot-toast';
import ProjectCreateLoader from '@/shared/ui/ProjectCreateLoader';

export const augmentationsMap = {
  horizontal: 'Horizontal Flip',
  vertical: 'Vertical Flip',
  rotation: 'Rotation',
  noise: 'Noise',
};

export default function AIAssembly() {
  const params = useParams();
  const [open, setOpenDrawer] = React.useState(false);
  const [modelsList, setModelsList] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [step, setStep] = useRecoilState(stepAtom);
  // const setModelId = useSetRecoilState(modelIdAtom);
  const configuration = useRecoilState(configurationAtom);
  // const classes = useRecoilState(classAtom);
  // const rois = useRecoilState();
  const datasets = useRecoilState(datasetAtom);
  const augmentations = useRecoilState(augmentationsAtom);
  const modelInfo = useRecoilState(modelInfoAtom);

  const handleNext = () => {
    setStep((t) => {
      if (t == 5) return t;
      return t + 1;
    });
  };

  const handleBack = () => {
    setStep((t) => {
      if (t == 1) return t;
      return t - 1;
    });
  };

  const trainingStatus = {
    0: { label: 'In progress', color: 'text-yellow-500' },
    [-1]: { label: 'Failed', color: 'text-red-500' },
    1: { label: 'Successful', color: 'text-green-500' },
  };

  const columns = [
    'Model Name',
    'Date Created',
    'Training Data',
    'Training Status',
    'Classes',
  ];

  const closeDrawer = () => {
    setOpenDrawer(false);
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
    } catch (error) {
      setLoading(false);
      toast.error(JSON.stringify(error));
    }
  };

  useEffect(() => {
    fetchModelsList();
  }, []);

  const startTraining = async () => {
    console.log('starting training');
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
        modelKey: modelInfoObj.modelKey,
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
      toast.error(JSON.stringify(error));
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
                        className={`px-6 py-4 ${trainingStatus[model.status].color}`}
                      >
                        {trainingStatus[model.status].label}
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
        <BuildNTrainDrawer />
      </Drawer>
      {/* </Toaster> */}
    </>
  );
}
