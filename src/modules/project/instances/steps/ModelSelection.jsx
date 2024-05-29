import { Accordion, AccordionBody, AccordionHeader } from '@material-tailwind/react'
import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil';
import { addInstanceAtom } from '../state';
import { removeDuplicates, setUniqueClassColors } from '@/util/util';
import Chip from '@/shared/ui/Chip';
import Radio from '@/shared/ui/Radio';
import axiosInstance from '@/core/request/aixosinstance';

const ModelSelection = ({ formRef }) => {
  const [open, setOpen] = useState([]);
  const [addInstance, setAddInstance] = useRecoilState(addInstanceAtom);
  const [classColors, setClassColors] = useState(new Map());
  const [selectedModels, setSelectedModels] = useState(addInstance?.modelSelection?.modelRoiMap || new Map());
  const [dataLength, setDataLength] = useState(0);
  const [errors, setErrors] = useState([]);
  const data = addInstance?.mappingData;

  const handleOpen = (index) => {
    const newOpen = [...open];
    newOpen[index] = !newOpen[index];
    setOpen(newOpen);
  }

  const filterClasses = () => {
    const classes = new Map();
    let classesData = [];
    addInstance?.mappingData?.forEach(data => {
      classesData = [...classesData, ...data?.classes]
    });

    setClassColors(setUniqueClassColors(classesData));
    setAddInstance({
      ...addInstance,
      colorClasses: classes
    })
  }

  const getModelsMapping = async () => {
    const res = await axiosInstance.get('/instance/deployed-models', {
      params: {
        instanceId: addInstance?.instanceId
      }
    })

    const mapping = res?.data?.data;
    const newMap = new Map();
    mapping.forEach(m => {
      newMap.set(m.roiId, m.detectionModelId);
    })
    setSelectedModels(newMap)
  }

  useEffect(() => {
    filterClasses()
    getModelsMapping()
  }, [])

  useEffect(() => {
    setOpen(Array.from({ length: data?.length }, () => true));
    let count = 0;
    data?.forEach(d => {
      count += d?.models?.length !== 0 ? 1 : 0;
    })
    setDataLength(count);
    setErrors(Array.from({length: data?.length}, () => ''))
    validate()
  }, [data])

  const handleChangeModel = (key, value) => {
    const newModels = new Map(selectedModels);
    newModels.set(key, value);
    setSelectedModels(newModels);
  }

  function Icon({ open }) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className={`${open ? "rotate-180" : ""} h-5 w-5 transition-transform`}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
    );
  }

  const updateAddInstance = (modelRoiMap) => {
    setAddInstance({
      ...addInstance,
      modelSelection: {
        modelRoiMap
      }
    })
  }

  const validate = () => {
    const formErrors = Array.from(errors);
    let flag = true;
    data?.forEach((d, index) => {
      formErrors[index] = d?.models?.length > 0 ? '' : 'Please train at least one model for this ROI to proceed further';
      if(formErrors[index]){
        setOpen(prev => {
          prev[index] = true;
          return prev;
        });
        flag = false;
      }else{
        flag = true;
      }
    })
    setErrors(formErrors)
    return flag;
  }

  const handleSubmit = async () => {
    try {
      if(!validate()){
        if (dataLength === 0 || selectedModels?.size !== dataLength) throw new Error('Please Select Model of all the ROIs');
        return null;
      }
      if (dataLength === 0 || selectedModels?.size !== dataLength) throw new Error('Please Select Model of all the ROIs');
      const instanceIds = Array.from({ length: dataLength }, () => addInstance?.instanceId);
      const modelIds = [];
      const roiIds = [];
      for (let [key, value] of selectedModels) {
        modelIds.push(value);
        roiIds.push(key)
      }
      const response = await axiosInstance.post('/instance/link-model', {
        instanceIds,
        modelIds,
        roiIds
      });

      updateAddInstance(selectedModels);
    } catch (error) {
      throw new Error(error?.response ? error?.response?.data?.data?.message : error?.message)
    }
  }

  formRef.current = {
    handleSubmit
  }

  const keys = ['variantName', 'capturePositionName', 'cameraConfigName', 'roiName'];

  return (
    <>
      <h1 className="text-2xl font-semibold">Model Selection</h1>
      <p className='my-4'>Select the trained AI-models to deploy in this instance</p>

      {data?.map(
        (modelData, index) => (
          <Accordion open={open[index]}>
            <AccordionHeader onClick={() => handleOpen(index)}>
              <div className="mr-2">
                <Icon open={open[index]} />
              </div>
              <div className='flex gap-4 justify-between' style={{ width: '100%' }}>
                <div className="flex justify-between" style={{ width: '70%' }}>
                  {keys.map(key => (
                    <div>{modelData[key]}</div>
                  ))}
                </div>
                <div className='flex justify-end gap-2' style={{ width: '30%' }}>
                  {modelData.classes.map(classData => (
                    <Chip color={classColors.get(classData?.id)?.color}>
                      {classData?.name}
                    </Chip>
                  )
                  )}
                </div>
              </div>
            </AccordionHeader>
            {open[index] &&
              (
                <AccordionBody className='rounded-lg' style={{marginTop: '-16px'}}>
                  {errors[index] && <p className="p-2 text-sm font-medium text-red-500 bg-[#F0F0FF] ml-4">{errors[index]}</p>}
                  {modelData?.models?.map(model => (
                    <>
                      <div className='flex justify-between py-2 px-2 rounded-md mb-0.5 bg-[#F0F0FF]'>
                        <div className="whitespace-nowrap font-medium text-gray-900 border-black">
                          <Radio
                            id={model?.id}
                            name={modelData?.roiId}
                            value={model?.id}
                            checked={selectedModels?.get(modelData?.roiId) === model?.id}
                            onChange={() => {
                              handleChangeModel(modelData?.roiId, model?.id);
                            }}
                          />{' '}
                        </div>
                        <div style={{ textAlign: 'left' }}>{model?.name}</div>
                        <div>{(new Date(Number(model?.createdAt))).toLocaleDateString()}</div>
                        <div className='flex justify-end gap-2 mr-4'>
                          {model?.classes?.map(id => {
                            return (
                              <Chip color={classColors.get(id)?.color}>
                                {classColors.get(id)?.name}
                              </Chip>
                            )
                          }
                          )}
                        </div>
                      </div>
                    </>
                  ))}
                </AccordionBody>
              )}
          </Accordion>
        )
      )}
    </>
  )
}

export default ModelSelection
