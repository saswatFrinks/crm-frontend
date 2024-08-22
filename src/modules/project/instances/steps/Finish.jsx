import React from 'react';
import { useRecoilState } from 'recoil';
import { addInstanceAtom, defaultAddInstanceValue } from '../state';
import Chip from '@/shared/ui/Chip';
import axiosInstance from '@/core/request/aixosinstance';

const Finish = ({ formRef, project }) => {
  const [addInstance, setAddInstance] = useRecoilState(addInstanceAtom);

  const isMoving = !project?.isItemFixed;

  const keys = [
    'variantName',
    'capturePositionName',
    'cameraConfigName',
    'roiName',
  ];

  const handleSubmit = async () => {
    try {
      await axiosInstance.post('/instance/activate', {
        instanceId: addInstance?.instanceId,
      });
      setAddInstance(defaultAddInstanceValue);
    } catch (error) {
      throw new Error(error?.response?.data?.data?.message);
    }
  };

  formRef.current = {
    handleSubmit,
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold">Finish</h1>
      <p className="my-4 text-xl">
        Review the details below to finish the instance creation and process to
        deployment
      </p>

      <div className="my-2 flex gap-2 text-xl">
        <h3 className="font-semibold">Instance Name:</h3>
        <div>{addInstance?.basic?.instanceName}</div>
      </div>

      <div className="my-2 flex gap-2 text-xl">
        <h3 className="font-semibold">Plant Name:</h3>
        <div>{addInstance?.basic?.plantName}</div>
      </div>

      <h2 className="my-4 text-xl font-semibold">
        Selected AI model will run in its respective ROI Configurations
      </h2>

      <div>
        {addInstance?.mappingData?.map((data, i) => (
          <div key={i}>
            <div
              className="my-2 flex justify-between gap-4"
              style={{ width: '100%' }}
            >
              <div className="flex justify-between flex-wrap" style={{ width: '70%' }}>
                {keys.map((key) => (
                  <div key={key}>{data[key]}</div>
                ))}
              </div>
              <div className="flex justify-end gap-2 flex-wrap" style={{ width: '30%' }}>
                {data.classes.map((classData, i) => (
                  <Chip
                  key={i}
                    color={addInstance?.colorClasses?.get(classData?.id)?.color}
                  >
                    {classData?.name}
                  </Chip>
                ))}
              </div>
            </div>
            <hr className="h-px border-0 bg-gray-400 dark:bg-gray-700" />
            {data?.models?.map((model, i) => {
              if (
                addInstance?.modelSelection?.modelRoiMap?.get(data?.roiId) !=
                model?.id
              )
                return <></>;
              return (
                <div
                  className="flex justify-between py-2"
                  style={{ backgroundColor: '#E7E7FF' }}
                  key={i}
                >
                  <div style={{ textAlign: 'left' }}>{model?.name}</div>
                  <div>
                    {new Date(Number(model?.createdAt)).toLocaleDateString()}
                  </div>
                  <div className="mr-4 flex justify-end gap-2 flex-wrap">
                    {model?.classes?.map((id, i) => {
                      return (
                        <Chip key={i} color={addInstance?.colorClasses?.get(id)?.color}>
                          {addInstance?.colorClasses?.get(id)?.name}
                        </Chip>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {isMoving && (
        <div className="my-4">
          <h2 className="my-4 text-xl font-semibold">
            Below selected AI models will run for their respective Primary
            Objects
          </h2>

          <div>
            {addInstance?.mappingData?.map((data, i) => (
              <div key={i}>
                <div
                  className="my-2 flex justify-between gap-4"
                  style={{ width: '100%' }}
                >
                  <div
                    className="flex justify-between flex-wrap"
                    style={{ width: '70%' }}
                  >
                    {keys.map((key) => {
                      if(key === 'roiName')return <></>
                      return <div key={key}>{data[key]}</div>
                    })}
                  </div>
                  <div
                    className="flex justify-end gap-2 flex-wrap"
                    style={{ width: '30%' }}
                  >
                    <Chip
                      color={addInstance?.colorClasses?.get(data?.primaryClass?.id)?.color}
                    >
                      {addInstance?.colorClasses?.get(data?.primaryClass?.id)?.name}
                    </Chip>
                  </div>
                </div>
                <hr className="h-px border-0 bg-gray-400 dark:bg-gray-700" />
                {data?.models?.map((model, i) => {
                  if (
                    addInstance?.modelSelection?.primaryRoiMap?.get(
                      data?.roiId
                    ) != model?.id
                  )
                    return <></>;
                  return (
                    <div
                      className="flex justify-between py-2"
                      style={{ backgroundColor: '#E7E7FF' }}
                      key={i}
                    >
                      <div style={{ textAlign: 'left' }}>{model?.name}</div>
                      <div>
                        {new Date(
                          Number(model?.createdAt)
                        ).toLocaleDateString()}
                      </div>
                      <div className="mr-4 flex justify-end gap-2 flex-wrap">
                        <Chip
                          color={addInstance?.colorClasses?.get(data?.primaryClass?.id)?.color}
                        >
                          {addInstance?.colorClasses?.get(data?.primaryClass?.id)?.name}
                        </Chip>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Finish;
