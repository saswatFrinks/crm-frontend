import axiosInstance from '@/core/request/aixosinstance';
import Select from '@/shared/ui/Select';
import React, { useEffect } from 'react'
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { addInstanceAtom } from '../state';
import { removeDuplicates } from '@/util/util';

const MapCameraIp = ({formRef}) => {
  const params = useParams();
  const [addInstance, setAddInstance] = useRecoilState(addInstanceAtom);
  const [data, setData] = React.useState([]);
  const [cameraIp, setCameraIp] = React.useState(addInstance?.mapCameraIp?.cameraIps || []);
  const [loaders, setLoaders] = React.useState([]);

  const setLoader = (index, flag) => {
    setLoaders(prev => {
      const newLoaders = [...prev];
      newLoaders[index] = flag;
      return newLoaders
    });
  }

  const onChangeCameraIp = async (e, index, capturePositionId) => {
    try {
      const selectedCameraId = e.target.value;
      setLoader(index, true)
      const data = {
        cameraId: selectedCameraId,
        capturePositionId,
        instanceId: addInstance?.instanceId
      }
      await axiosInstance.post('/cameraDetails/create', data);
      const newCameraIps = [...cameraIp];
      newCameraIps[index] = selectedCameraId;
      setCameraIp(newCameraIps);
      setAddInstance({
        ...addInstance,
        mapCameraIp: {
          data,
          cameraIps: newCameraIps
        }
      })
    } catch (error) {
      toast.error(error?.response?.data?.data?.message);
    } finally {
      setLoader(index, false);
    }
  }

  const fetchAllData = async () => {
    try {
      const response = await axiosInstance.get('/roi/models', {
        params: {
          instanceId: addInstance?.instanceId
        }
      })
      const responseData = await response?.data?.data
      
      const mappingData = await responseData?.map(d => ({
        variantName: d.variantName,
        variantId: d.variantId,
        cameraPositionName: d.capturePositionName,
        cameraPositionId: d.capturePositionId
      }))

      setAddInstance({
        ...addInstance,
        mappingData: responseData
      })

      const uniqueEntries = removeDuplicates(await mappingData);
      setData(uniqueEntries);
    } catch (error) {
      toast.error(error?.response?.data?.data?.message);
    }
  }

  const fetchMapping = async () => {
    const res = await axiosInstance.get('/instance/camera-mapping', {
      params: {
        instanceId: addInstance?.instanceId
      }
    });

    const cameraMappings = await res?.data?.data;
    data?.forEach((d, index) => {
      const cpId = d?.cameraPositionId;
      const cameraId = cameraMappings?.find(mapping => {
        return mapping?.capture_position?.id === cpId
      });
      const newIps = [...cameraIp];
      newIps[index] = cameraId?.camera?.id;
      setCameraIp(newIps);
    })
    
  }

  useEffect(() => {
    fetchAllData();
  }, [])

  useEffect(() => {
    fetchMapping()
  }, [data])

  useEffect(() => {
    if(addInstance?.mapCameraIp?.cameraIps?.length === 0){
      setCameraIp(Array.from({length: data?.length}, () => null));
      setLoaders(Array.from({length: data?.length}, () => false));
    }
  }, [data])

  const columns = ['Variant', 'Camera Position', 'Select Camera'];

  const cameraIps = addInstance?.basic?.cameraIps?.map((camera, i) => {
    return {
      id: camera.id,
      name: `(${camera.cameraIp})`
    }
  })

  const handleSubmit = () => {
    if(cameraIp.some(ip => (ip == null)))throw new Error('Please Select All Camera IP')
    setAddInstance({
      ...addInstance,
      mapCameraIp: {
        data,
        cameraIps: cameraIp
      }
    })
  }

  formRef.current = {
    handleSubmit
  }

  return (
    <div>
      <h1 className=" text-2xl font-semibold">Map Camera IP</h1>
      <p className='my-4'>Map the camera IP for each variant and it’s respective camera position.</p>

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
                  key={`${dataItem?.variantId}/${dataItem?.cameraPositionId}`}
                >
                  <td className="px-6 py-4">{dataItem?.variantName}</td>
                  <td className="px-6 py-4">{dataItem?.cameraPositionName}</td>
                  <td className="px-6 py-4">
                    <Select
                      disabled={loaders[index]}
                      options={cameraIps}
                      value = {cameraIp[index] !== null ? cameraIp[index] : ''}
                      placeholder='Select Camera'
                      onChange = {(e) => {
                        onChangeCameraIp(e, index, dataItem?.cameraPositionId);
                      }}
                    /> {loaders[index] && 'Loading...'}
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

export default MapCameraIp
