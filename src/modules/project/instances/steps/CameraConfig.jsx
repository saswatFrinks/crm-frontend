import React from 'react'
import { useRecoilState } from 'recoil'
import { addInstanceAtom } from '../state'
import axiosInstance from '@/core/request/aixosinstance';
import Upload from '@/shared/icons/Upload';
import { removeDuplicates } from '@/util/util';
import toast from 'react-hot-toast';
import { modalAtom } from '@/shared/states/modal.state';
import Modal, { ModalBody, ModalHeader } from '@/shared/ui/Modal';
import CheckCircle from '@/shared/icons/CheckCircle';

const CameraConfig = ({formRef, configUploaded}) => {
  const [addInstance, setAddInstance] = useRecoilState(addInstanceAtom);
  const [data, setData] = React.useState([]);
  const [files, setFiles] = React.useState(addInstance?.cameraConfig?.files || []);
  const [uploaded, setUploaded] = React.useState([]);
  const [loader, setLoader] = React.useState(false);
  const [configDetails, setConfigDetails] = React.useState(null);
  const [open, setOpen] = useRecoilState(modalAtom);

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
    setData(uniqueData);
  }, [])

  React.useEffect(() => {
    if(files?.length === 0){
      setFiles(Array.from({length: data?.length}, () => (configUploaded ? true : false)));
      setUploaded(Array.from({length: data?.length}, () => false))
    }
  }, [data])

  const handleSubmit = () => {
    try {
      if(files.some(file => file == false))throw new Error('Please Upload all the files');
      setAddInstance({
        ...addInstance,
        cameraConfig: {
          files
        }
      });
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
      await axiosInstance.post('/instance/upload-config', formData);
      setFiles(prev => {
        const newFiles = [...prev];
        newFiles[index] = true;
        return newFiles
      });
      setUploaded(prev => {
        const newStatus = [...prev];
        newStatus[index] = true;
        return newStatus
      });
    } catch (error) {
      toast.error(error?.response?.data?.data);
    }
  }

  const viewConfigDetails = async (configId) => {
    try {
      setOpen(true);
      setLoader(true);
      const response = await axiosInstance.get('/cameraDetails/get-config', {
        params: {
          instanceId: addInstance?.instanceId,
          cameraConfigId: configId
        }
      });

      setConfigDetails(response?.data?.data);
    } catch (error) {
      toast.error(error?.response?.data?.data?.message);
    } finally {
      setLoader(false);
    }
  }

  const columns = ['Variant', 'Camera Position', 'Camera Config', 'Upload Camera Config File']

  const headings = ['fps', 'gain', 'gamma', 'height', 'width', 'pin'];

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
                  <td className="px-6 py-4 flex items-center gap-4">
                    {files[index] && (
                      <div>
                        <label 
                          className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-f-primary px-10 py-2 text-white duration-100 hover:bg-f-secondary"
                          onClick={() => viewConfigDetails(dataItem?.cameraConfigId)}
                        >
                          View
                        </label>
                      </div>
                    )}
                    <label 
                      className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-f-primary px-10 py-2 text-white duration-100 hover:bg-f-secondary"
                    >
                      <input type="file" hidden onChange={async (e) => {
                        await handleConfigUpload(e.target.files[0], index, dataItem?.cameraConfigId);
                        e.target.files = null;
                        e.target.value = null;
                      }}/>
                      <Upload /> {files[index] ? 'Change' : 'Upload'}
                    </label>
                    {uploaded[index] && <CheckCircle />}
                  </td>
                </tr>
              );
            })}
            </tbody>
        </table>
      </div>

      <Modal>
        <ModalHeader>Camera Configuration Details</ModalHeader>

        <ModalBody>
          {loader ? (
            <div>Loading...</div>
          ) : (
            <div className="flex gap-4 items-center justify-center">
              <div className="flex flex-col items-start gap-2">
                {headings.map(heading => (
                  <h3 className='font-bold'>{heading.charAt(0).toUpperCase() + heading.slice(1)}:</h3>
                ))}
              </div>
              <div className="flex flex-col items-start gap-2">
                {headings.map(heading => (
                  <h3>{configDetails ? configDetails[heading] : null}</h3>
                ))}
              </div>
            </div>
          )}
        </ModalBody>
      </Modal>
    </div>
  )
}

export default CameraConfig
