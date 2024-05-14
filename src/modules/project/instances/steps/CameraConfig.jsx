import React from 'react'
import { useRecoilState } from 'recoil'
import { addInstanceAtom } from '../state'
import axiosInstance from '@/core/request/aixosinstance';
import Upload from '@/shared/icons/Upload';
import { removeDuplicates } from '@/util/util';

const CameraConfig = ({formRef}) => {
  const [addInstance, setAddInstance] = useRecoilState(addInstanceAtom);
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    const cameraConfigData = addInstance?.mappingData?.map(d => ({
      variantName: d.variantName,
      variantId: d.variantId,
      cameraPositionName: d.capturePositionName,
      cameraPositionId: d.capturePositionId,
      cameraConfigName: d.cameraConfigName,
      cameraConfigId: d.cameraConfigId
    }));

    const uniqueData = removeDuplicates(cameraConfigData);
    console.log({uniqueData})
    setData(uniqueData);
  }, [])

  const handleSubmit = () => {
    
  }

  formRef.current = {
    handleSubmit
  }

  const columns = ['Variant', 'Camera Position', 'Camera Config', 'Upload Camera Config File']

  return (
    <div>
      <h1 className=" text-2xl font-semibold">Upload Camera Config File</h1>
      <p className='my-4'>Upload the camera configuration file for each case as listed below</p>

      <div className="placeholder:*: relative shadow-md sm:rounded-lg mt-4">
        <table className="w-full text-left text-sm text-gray-500 rtl:text-right ">
          <thead className="bg-white text-sm uppercase text-gray-700 ">
            <tr>
              {columns?.map((t) => (
                <th scope="col" className="px-6 py-3" key={t}>
                  {t}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.map((dataItem, index) => {
              return (
                <tr
                  className="border-b odd:bg-white even:bg-[#C6C4FF]/10"
                  key={`${dataItem?.variantId}/${dataItem?.cameraPositionId}/${dataItem?.cameraConfigId}`}
                >
                  <td className="px-6 py-4">{dataItem?.variantName}</td>
                  <td className="px-6 py-4">{dataItem?.cameraPositionName}</td>
                  <td className="px-6 py-4">{dataItem?.cameraConfigName}</td>
                  <td className="px-6 py-4">
                    <label 
                      className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-f-primary px-20 py-2 text-white duration-100 hover:bg-f-secondary"
                      onClick={() => {
                        
                      }}
                    >
                      <input type="file" accept='.png' hidden onChange={() => {}}/>
                      <Upload /> Upload
                    </label>
                  </td>
                </tr>
              );
            })}
            </tbody>
        </table>
      </div>
    </div>
  )
}

export default CameraConfig
