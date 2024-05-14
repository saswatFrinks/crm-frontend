import React from 'react'
import { useRecoilState } from 'recoil'
import { addInstanceAtom } from '../state'
import axiosInstance from '@/core/request/aixosinstance';
import Upload from '@/shared/icons/Upload';
import { removeDuplicates } from '@/util/util';
import toast from 'react-hot-toast';

const CameraConfig = ({formRef}) => {
  const [addInstance, setAddInstance] = useRecoilState(addInstanceAtom);
  const [data, setData] = React.useState([]);
  const [files, setFiles] = React.useState([]);

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

  React.useEffect(() => {
    setFiles(Array.from({length: data?.length}, () => null));
  }, [data])

  const handleSubmit = () => {
    try {
      if(files.some(file => file == null))throw new Error('Please Upload all the files');
    } catch (error){
      throw new Error(error?.response ? error?.response?.data?.data?.message : error?.message)
    }
  }

  formRef.current = {
    handleSubmit
  }

  const handleConfigUpload = async (file, index, cameraConfigId) => {
    try {
      const formData = new FormData();
      formData.append('instanceId', addInstance?.instanceId);
      formData.append('cameraConfigId', cameraConfigId);
      formData.append('file', file);
      const response = await axiosInstance.post('/instance/upload-config', formData);
      console.log({response});
      setFiles(prev => {
        const newFiles = [...prev];
        newFiles[index] = file;
        return newFiles
      });
    } catch (error) {
      toast.error(error?.response?.data?.data);
    }
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
                    >
                      <input type="file" disabled={files[index]} hidden onChange={async (e) => {
                        await handleConfigUpload(e.target.files[0], index, dataItem?.cameraConfigId);
                        e.target.files = null;
                        e.target.value = null;
                      }}/>
                      <Upload /> Upload
                    </label>
                    {files[index] && <div>Uploaded</div>}
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
