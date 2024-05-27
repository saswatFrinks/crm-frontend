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
  const [configDetails, setConfigDetails] = React.useState(new Map())
  const [modalConfig, setModalConfig] = React.useState(null);
  const [errors, setErrors] = React.useState([]);
  const [open, setOpen] = useRecoilState(modalAtom);

  const columns = ['Variant', 'Camera Position', 'Camera Config', 'Upload Camera Config File']

  const headings = ['fps', 'gain', 'gamma', 'height', 'width', 'pin'];

  React.useEffect(() => {
    const cameraConfigData = addInstance?.mappingData?.map(d => ({
      variantName: d.variantName,
      variantId: d.variantId,
      cameraPositionName: d.capturePositionName,
      cameraPositionId: d.capturePositionId,
      cameraConfigName: d.cameraConfigName,
      cameraConfigId: d.cameraConfigId,
      roiName: d?.roiName,
      roiId: d?.roiId
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

  const validate = () => {
    const formErrors = [...errors];
    let flag = true;
    data?.forEach((d, index) => {
      formErrors[index] = d?.roiId ? '' : `This Camera Config doesn't have any ROIs`;
      flag = d?.roiId ? true : false;
    })
    setErrors(formErrors);
    if(!flag)return false;

    data?.forEach((d, index) => {
      formErrors[index] = configDetails.get(d?.cameraConfigId) ? '' : (formErrors[index] !== '' ? formErrors[index] : 'Please upload the camera config file');
      flag = configDetails.get(d?.cameraConfigId) ? true : false;
    })
    setErrors(formErrors);
    return flag;
  }

  const handleSubmit = () => {
    try {
      if(!validate())return null;
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
      viewConfigDetails(cameraConfigId)
    } catch (error) {
      toast.error(error?.response?.data?.data);
    }
  }

  const viewConfigDetails = async (configId) => {
    try {
      setLoader(true);
      const response = await axiosInstance.get('/cameraDetails/get-config', {
        params: {
          instanceId: addInstance?.instanceId,
          cameraConfigId: configId
        }
      });
      const details = response?.data?.data;

      setConfigDetails((prev) => {
        const isNull = headings.some(heading => details[heading] == null);
        prev.set(configId, isNull ? null : details)
        return prev;
      });
      setModalConfig(response?.data?.data)
    } catch (error) {
      toast.error(error?.response?.data?.data?.message);
    } finally {
      setLoader(false);
    }
  }

  const getAllConfigs = async () => {
    for(let i=0;i<data.length;i++){
      await viewConfigDetails(data[i]?.cameraConfigId);
    }
  }

  React.useEffect(() => {
    if(data.length > 0){
      getAllConfigs();
    }
    setErrors(Array.from({length: data?.length}, () => ''))
  }, [data])

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
                <>
                  <tr
                    className="border-b odd:bg-white even:bg-[#C6C4FF]/10"
                    key={`${dataItem?.variantId}/${dataItem?.cameraPositionId}/${dataItem?.cameraConfigId}`}
                  >
                    <td className="px-6 py-4">{dataItem?.variantName}</td>
                    <td className="px-6 py-4">{dataItem?.cameraPositionName}</td>
                    <td className="px-6 py-4">{dataItem?.cameraConfigName}</td>
                    <td className="px-6 py-4 flex items-center gap-4">
                      {configDetails.get(dataItem?.cameraConfigId) && (
                        <div>
                          <label 
                            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-f-primary px-10 py-2 text-white duration-100 hover:bg-f-secondary"
                            onClick={() => {
                              viewConfigDetails(dataItem?.cameraConfigId)
                              setOpen(true);
                            }}
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
                        <Upload /> {configDetails.get(dataItem?.cameraConfigId) ? 'Change' : 'Upload'}
                      </label>
                      {uploaded[index] && <CheckCircle />}
                    </td>
                  </tr>
                  {(errors[index]) && <tr>
                    <p className="p-2 text-sm font-medium text-red-500">{errors[index]}</p>
                  </tr>}
                </>
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
                  <h3>{modalConfig ? modalConfig[heading] : null}</h3>
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
