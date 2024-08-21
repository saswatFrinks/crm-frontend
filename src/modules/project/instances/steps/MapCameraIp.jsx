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
  const [cameraIp, setCameraIp] = React.useState([]);
  const [errors, setErrors] = React.useState([]);
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
      setErrors(prev => {
        const newErrors = [...prev];
        newErrors[index] = selectedCameraId ? '' : `Please map camera IP ${index+1}`;
        return newErrors;
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
    const newIps = Array.from(cameraIp);
    data?.forEach((d, index) => {
      const cpId = d?.cameraPositionId;
      const cameraId = cameraMappings?.find(mapping => {
        return mapping?.capture_position?.id === cpId
      });
      newIps[index] = cameraId?.camera?.id;
    })
    setCameraIp(newIps);
  }

  useEffect(() => {
    fetchAllData();
  }, [])

  useEffect(() => {
    fetchMapping()
  }, [data])

  useEffect(() => {
    if(cameraIp.length === 0){
      setCameraIp(Array.from({length: data?.length}, () => null));
      setLoaders(Array.from({length: data?.length}, () => false));
      setErrors(Array.from({length: data?.length}, () => ''))
    }
  }, [data])

  const columns = ['Variant', 'Camera Position', 'Select Camera'];

  const cameraIps = addInstance?.basic?.cameraIps?.map((camera, i) => {
    return {
      id: camera.id,
      name: `(${camera.cameraIp})`
    }
  })

  const validateForm = () => {
    const formErrors = errors.map((error, index) => {
      return `Please map camera IP ${index+1}`
    });
    cameraIp.forEach((ip, index) => {
      formErrors[index] = !ip ? `Please map camera IP ${index+1}` : ''
    }) 
    return formErrors;
  }

  const handleSubmit = () => {
    setErrors(validateForm());
    if(validateForm().some(error => error !== ''))return null;
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
              const variantId = dataItem?.variantId;
              const ipExcludeOptions = [];
              data?.forEach((d, i) => {
                if(d.variantId === variantId && i !== index && cameraIp[i]){
                  ipExcludeOptions.push(cameraIp[i]);
                }
              })
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
                      options={cameraIps.filter(i => !ipExcludeOptions.includes(i.id))}
                      value = {cameraIp[index] !== null ? cameraIp[index] : ''}
                      placeholder='Select Camera'
                      onChange = {(e) => {
                        onChangeCameraIp(e, index, dataItem?.cameraPositionId);
                      }}
                      errorMessage = {errors[index]}
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
