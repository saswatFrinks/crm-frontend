import React from 'react'
import { useRecoilState } from 'recoil'
import { addInstanceAtom } from '../state'
import Chip from '@/shared/ui/Chip';

const Finish = ({formRef, handleClose}) => {
  const [addInstance, setAddInstance] = useRecoilState(addInstanceAtom);

  const keys = ['variantName', 'capturePositionName', 'cameraConfigName', 'roiName'];

  const handleSubmit = () => {
    handleClose();
  }

  formRef.current = {
    handleSubmit
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Finish</h1>
      <p className='my-4 text-xl'>Review the details below to finish the instance creation and process to deployment</p>

      <div className="flex gap-2 my-2 text-xl">
        <h3 className='font-semibold'>Instance Name:</h3>
        <div>{addInstance?.basic?.instanceName}</div>
      </div>

      <div className="flex gap-2 my-2 text-xl">
        <h3 className='font-semibold'>Plant Name:</h3>
        <div>{addInstance?.basic?.plantName}</div>
      </div>

      <h2 className='font-semibold my-4 text-xl'>Selected AI model will run in its respective ROI Configurations</h2>

      <div>
        {addInstance?.mappingData?.map(data => (
          <div>
            <div className='flex gap-4 justify-between my-2' style={{ width: '100%' }}>
              <div className="flex justify-between" style={{ width: '70%' }}>
                {keys.map(key => (
                  <div>{data[key]}</div>
                ))}
              </div>
              <div className='flex justify-end gap-2' style={{ width: '30%' }}>
                {data.classes.map(classData => (
                  <Chip color={addInstance?.colorClasses?.get(classData?.id)?.color}>
                    {classData?.name}
                  </Chip>
                ))}
              </div>
            </div>
            <hr className='h-px border-0 bg-gray-400 dark:bg-gray-700' />
            {data?.models?.map(model => {
              if(addInstance?.modelSelection?.modelRoiMap?.get(data?.roiId) != model?.id)return <></>
              return (
                <div className='flex justify-between py-2' style={{ backgroundColor: '#E7E7FF' }}>
                  <div style={{ textAlign: 'left' }}>{model?.name}</div>
                  <div>{(new Date(Number(model?.createdAt))).toLocaleDateString()}</div>
                  <div className='flex justify-end gap-2 mr-4'>
                    {model?.classes?.map(id => {
                      return (
                        <Chip color={addInstance?.colorClasses?.get(id)?.color}>
                          {addInstance?.colorClasses?.get(id)?.name}
                        </Chip>
                      )
                    }
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Finish
