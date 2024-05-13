import React from 'react'
import { useRecoilState } from 'recoil'
import { addInstanceAtom } from '../state'
import axiosInstance from '@/core/request/aixosinstance';
import Upload from '@/shared/icons/Upload';

const CameraConfig = ({formRef}) => {
  const [addInstance, setAddInstance] = useRecoilState(addInstanceAtom);
  const [data, setData] = React.useState([]);

  const fetchData = async () => {
    await Promise.all([
      addInstance?.mapCameraIp?.data.map(d => {
        return fetchAllCameraConfigs(d)
      })
    ])
  }

  const fetchAllCameraConfigs = async (cameraPosition) => {
    try {
      const res = await axiosInstance.get('/cameraConfig/fetch', {
        params: {
          capturePositionId: cameraPosition.cameraPosition.id,
        },
      });
      
      const cameraConfigs = await res?.data?.data;
      const tableData = await cameraConfigs.map(config => {
        return {
          ...cameraPosition,
          config
        }
      });

      setData(prev => {
        return [
          ...prev,
          ...tableData
        ]
      })
    } catch (error) {
      toast.error(error.response.data.data.message)
    }
  };

  React.useEffect(() => {
    fetchData()
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
                  key={`${dataItem?.variant?.id}/${dataItem?.cameraPosition?.id}/${dataItem?.config?.id}`}
                >
                  <td className="px-6 py-4">{dataItem?.variant?.name}</td>
                  <td className="px-6 py-4">{dataItem?.cameraPosition?.name}</td>
                  <td className="px-6 py-4">{dataItem?.config?.name}</td>
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
