import axiosInstance from '@/core/request/aixosinstance';
import Select from '@/shared/ui/Select';
import React, { useEffect } from 'react'
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { addInstanceAtom } from '../state';

const MapCameraIp = ({formRef}) => {
  const params = useParams();
  const [addInstance, setAddInstance] = useRecoilState(addInstanceAtom);
  const [data, setData] = React.useState([]);
  const [cameraIp, setCameraIp] = React.useState(addInstance?.mapCameraIp?.cameraIps || []);

  const onChangeCameraIp = (e, i) => {
    const newCameraIps = [...cameraIp];
    newCameraIps[i] = Number(e.target.value);
    setCameraIp(newCameraIps);
  }

  const fetchAllVariants = async () => {
    try {
      const res = await axiosInstance.get('/variant/fetch', {
        params: {
          projectId: params.projectId,
        },
      });
      const variants = res?.data?.data;
      await Promise.all(variants.map(variant => {
        return fetchAllCameraPosition(variant)
      }));
    } catch (error) {
      toast.error(error?.response?.data?.data?.message)
    }
  };

  const fetchAllCameraPosition = async (variant) => {
    try {
      const res = await axiosInstance.get('/capturePosition/fetch', {
        params: {
          variantId: variant.id
        },
      });
      const cameraPositions = await res?.data?.data;
      const tableData = await cameraPositions.map(position => {
        return {
          variant,
          cameraPosition: position
        }
      });
      setData(prev => (
        [
          ...prev,
          ...tableData
        ]
      ))
    } catch (error) {
      toast.error(error?.response?.data?.data?.message)
    }
  };

  useEffect(() => {
    fetchAllVariants();
  }, [])

  useEffect(() => {
    if(addInstance?.mapCameraIp?.cameraIps?.length === 0){
      setCameraIp(Array.from({length: data?.length}, () => null));
    }
  }, [data])

  const columns = ['Variant', 'Camera Position', 'Select Camera'];

  const cameraIps = addInstance?.basic?.cameraIps?.map((camera, i) => {
    return {
      id: i,
      name: `Camera ${i+1} (${camera})`
    }
  })

  const handleSubmit = () => {
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
                  key={`${dataItem?.variant?.id}/${dataItem?.cameraPosition?.id}`}
                >
                  <td className="px-6 py-4">{dataItem?.variant?.name}</td>
                  <td className="px-6 py-4">{dataItem?.cameraPosition?.name}</td>
                  <td className="px-6 py-4">
                  <Select
                    options={cameraIps}
                    value = {cameraIp[index] !== null ? cameraIp[index] : ''}
                    placeholder='Select Camera'
                    onChange = {(e) => {
                      onChangeCameraIp(e, index);
                    }}
                  />
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
