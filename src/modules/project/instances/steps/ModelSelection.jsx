import {
  Accordion,
  AccordionBody,
  AccordionHeader,
} from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { addInstanceAtom } from '../state';
import { removeDuplicates, setUniqueClassColors } from '@/util/util';
import Chip from '@/shared/ui/Chip';
import Radio from '@/shared/ui/Radio';
import axiosInstance from '@/core/request/aixosinstance';

const ModelSelection = ({ formRef, project }) => {
  const [open, setOpen] = useState([]);
  const [addInstance, setAddInstance] = useRecoilState(addInstanceAtom);
  const [classColors, setClassColors] = useState(new Map());
  const [selectedModels, setSelectedModels] = useState(
    addInstance?.modelSelection?.modelRoiMap || new Map()
  );
  const [selectedPrimaryModels, setSelectedPrimaryModels] = useState(
    addInstance?.modelSelection?.primaryRoiMap || new Map()
  );
  const [dataLength, setDataLength] = useState(0);
  const [errors, setErrors] = useState([]);
  const data = addInstance?.mappingData;
  const isMoving = !project?.isItemFixed;

  const handleOpen = (index) => {
    const newOpen = [...open];
    newOpen[index] = !newOpen[index];
    setOpen(newOpen);
  };

  const filterClasses = () => {
    let classesData = [];
    addInstance?.mappingData?.forEach((data) => {
      classesData = [...classesData, ...data?.classes];
    });

    data?.forEach(item => {
      if(item?.primaryClass){
        classesData.push({
          ...item.primaryClass,
          name: item?.primaryClass?.className
        });
      }
    })
    setClassColors(setUniqueClassColors(classesData));
    setAddInstance({
      ...addInstance,
      colorClasses: setUniqueClassColors(classesData),
    });
  };

  const getModelsMapping = async () => {
    const res = await axiosInstance.get('/instance/deployed-models', {
      params: {
        instanceId: addInstance?.instanceId,
      },
    });

    const mapping = res?.data?.data;
    const newMap = new Map();
    const newPrimaryMap = new Map();
    const allModels = []
    data?.forEach(item => {
      item?.models?.forEach(model => {
        if(model?.isTracker)allModels.push(model?.id);
      })
    })
    mapping.forEach((m) => {
      if(allModels.includes(m?.detectionModelId)){
        newPrimaryMap.set(m.roiId, m.detectionModelId);
      }else{
        newMap.set(m.roiId, m.detectionModelId);
      }
    });
    setSelectedModels(newMap);
    setSelectedPrimaryModels(newPrimaryMap);
  };

  useEffect(() => {
    filterClasses();
    getModelsMapping();
  }, []);

  useEffect(() => {
    setOpen(Array.from({ length: data?.length }, () => true));
    let count = 0;
    data?.forEach((d) => {
      count += d?.models?.length !== 0 ? 1 : 0;
    });
    setDataLength(count);
    setErrors(Array.from({ length: data?.length }, () => ''));
    validate();
  }, [data]);

  const handleChangeModel = (key, value) => {
    const newModels = new Map(selectedModels);
    newModels.set(key, value);
    setSelectedModels(newModels);
  };

  const handleChangePrimaryModel = (key, value) => {
    const newModels = new Map(selectedPrimaryModels);
    newModels.set(key, value);
    setSelectedPrimaryModels(newModels);
  };

  function Icon({ open }) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className={`${open ? 'rotate-180' : ''} h-5 w-5 transition-transform`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
        />
      </svg>
    );
  }

  const updateAddInstance = (modelRoiMap, primaryROIMap = null) => {
    setAddInstance({
      ...addInstance,
      modelSelection: {
        modelRoiMap,
        primaryRoiMap: primaryROIMap
      },
    });
  };

  const validate = () => {
    const formErrors = Array.from(errors);
    let flag = true;
    data?.forEach((d, index) => {
      formErrors[index] =
        d?.models?.length > 0
          ? ''
          : 'Please train at least one model for this ROI to proceed further';
      if (formErrors[index]) {
        setOpen((prev) => {
          prev[index] = true;
          return prev;
        });
        flag = false;
      } else {
        flag = true;
      }
    });
    setErrors(formErrors);
    return flag;
  };

  const handleSubmit = async () => {
    try {
      if (!validate()) {
        if (dataLength === 0 || selectedModels?.size !== dataLength)
          throw new Error('Please Select Model of all the ROIs');
        return null;
      }
      if (dataLength === 0 || selectedModels?.size !== dataLength)
        throw new Error('Please Select Model of all the ROIs');
      if (isMoving && selectedPrimaryModels?.size !== data?.filter(d => d?.models?.some(m => m.isTracker))?.length)
        throw new Error('Please Select Model of all the Primary Objects');
      const instanceIds = Array.from(
        { length: (dataLength + selectedPrimaryModels?.size) },
        () => addInstance?.instanceId
      );
      const modelIds = [];
      const roiIds = [];
      for (let [key, value] of selectedModels) {
        modelIds.push(value);
        roiIds.push(key);
      }
      for (let [key, value] of selectedPrimaryModels) {
        modelIds.push(value);
        roiIds.push(key);
      }
      const response = await axiosInstance.post('/instance/link-model', {
        instanceIds,
        modelIds,
        roiIds,
      });

      updateAddInstance(selectedModels, selectedPrimaryModels);
    } catch (error) {
      throw new Error(
        error?.response ? error?.response?.data?.data?.message : error?.message
      );
    }
  };

  formRef.current = {
    handleSubmit,
  };

  const keys = [
    'variantName',
    'capturePositionName',
    'cameraConfigName',
    'roiName',
  ];

  return (
    <>
      <h1 className="text-2xl font-semibold">Model Selection</h1>
      <p className="my-4 font-medium">
        Select the trained AI-models to deploy in this instance
      </p>

      {data?.map((modelData, index) => (
        <Accordion key={index} open={open[index]}>
          <AccordionHeader onClick={() => handleOpen(index)}>
            <div className="mr-2">
              <Icon open={open[index]} />
            </div>
            <div
              className="flex justify-between gap-4"
              style={{ width: '100%' }}
            >
              <div className="flex justify-between" style={{ width: '70%' }}>
                {keys.map((key) => (
                  <div key={key}>{modelData[key]}</div>
                ))}
              </div>
              <div className="flex justify-end gap-2 flex-wrap" style={{ width: '30%' }}>
                {modelData.classes.map((classData, i) => (
                  <Chip key={i} color={classColors.get(classData?.id)?.color}>
                    {classData?.name}
                  </Chip>
                ))}
              </div>
            </div>
          </AccordionHeader>
          {open[index] && (
            <AccordionBody
              className="rounded-lg"
              style={{ marginTop: '-16px' }}
            >
              {errors[index] && (
                <p className="ml-4 bg-[#F0F0FF] p-2 text-sm font-medium text-red-500">
                  {errors[index]}
                </p>
              )}
              {modelData?.models
                ?.filter((mo) => !mo.isTracker)
                ?.map((model) => (
                  <>
                    <div className="mb-0.5 flex justify-between rounded-md bg-[#F0F0FF] px-2 py-2 gap-2">
                      <div className="whitespace-nowrap border-black font-medium text-gray-900">
                        <Radio
                          id={model?.id}
                          name={modelData?.roiId}
                          value={model?.id}
                          checked={
                            selectedModels?.get(modelData?.roiId) === model?.id
                          }
                          onChange={() => {
                            handleChangeModel(modelData?.roiId, model?.id);
                          }}
                        />{' '}
                      </div>
                      <div style={{ textAlign: 'left' }}>{model?.name}</div>
                      <div>
                        {new Date(
                          Number(model?.createdAt)
                        ).toLocaleDateString()}
                      </div>
                      <div className="mr-4 flex justify-end gap-2 flex-wrap">
                        {model?.classes?.map((id, i) => {
                          return (
                            <Chip key={i} color={classColors.get(id)?.color}>
                              {classColors.get(id)?.name}
                            </Chip>
                          );
                        })}
                      </div>
                    </div>
                  </>
                ))}
            </AccordionBody>
          )}
        </Accordion>
      ))}

      {isMoving && (
        <div className="my-4 border-t-[1px]">
          <p className="my-4 font-medium">
            Select the trained AI-models to deploy in this instance for each of the following Primary Objects
          </p>

          {data?.map((modelData, index) => (
            <Accordion key={index} open={open[index]}>
              <AccordionHeader onClick={() => handleOpen(index)}>
                <div className="mr-2">
                  <Icon open={open[index]} />
                </div>
                <div
                  className="flex justify-between gap-4 flex-wrap"
                  style={{ width: '100%' }}
                >
                  <div
                    className="flex justify-between"
                    style={{ width: '70%' }}
                  >
                    {keys.map((key) => {
                      if(key == 'roiName')return <></>
                      return <div key={key}>{modelData[key]}</div>
                    })}
                    <div>{modelData?.primaryClass?.name}</div>
                  </div>
                  <Chip color={classColors.get(modelData?.primaryClass?.id)?.color}>
                    {classColors.get(modelData?.primaryClass?.id)?.name}
                  </Chip>
                </div>
              </AccordionHeader>
              {open[index] && (
                <AccordionBody
                  className="rounded-lg"
                  style={{ marginTop: '-16px' }}
                >
                  {errors[index] && (
                    <p className="ml-4 bg-[#F0F0FF] p-2 text-sm font-medium text-red-500">
                      {errors[index]}
                    </p>
                  )}
                  {modelData?.models
                    ?.filter((mo) => mo.isTracker && modelData?.primaryClass)
                    ?.map((model) => (
                      <>
                        <div className="mb-0.5 flex justify-between rounded-md bg-[#F0F0FF] px-2 py-2">
                          <div className="whitespace-nowrap border-black font-medium text-gray-900">
                            <Radio
                              id={model?.id}
                              name={modelData?.roiId}
                              value={model?.id}
                              checked={
                                selectedPrimaryModels?.get(modelData?.roiId) ===
                                model?.id
                              }
                              onChange={() => {
                                handleChangePrimaryModel(modelData?.roiId, model?.id);
                              }}
                            />{' '}
                          </div>
                          <div style={{ textAlign: 'left' }}>{model?.name}</div>
                          <div>
                            {new Date(
                              Number(model?.createdAt)
                            ).toLocaleDateString()}
                          </div>
                          <div className="mr-4 flex justify-end gap-2 flex-wrap">
                            <Chip color={classColors.get(modelData?.primaryClass?.id)?.color}>
                              {classColors.get(modelData?.primaryClass?.id)?.name}
                            </Chip>
                          </div>
                        </div>
                      </>
                    ))}
                </AccordionBody>
              )}
            </Accordion>
          ))}
        </div>
      )}
    </>
  );
};

export default ModelSelection;
