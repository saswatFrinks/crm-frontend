import axiosInstance from '@/core/request/aixosinstance';
import ArrowRight from '@/shared/icons/ArrowRight';
import Setting from '@/shared/icons/Setting';
import Heading from '@/shared/layouts/main/heading';
import Button from '@/shared/ui/Button';
import Radio from '@/shared/ui/Radio';
import React from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { assemblyAtom } from '../state';
import { selectedConfigurationAtom } from '../project-configuration/state';
import Modal from '@/shared/ui/Modal';
import WarningModal from './WarningModal';
import { modalAtom } from '@/shared/states/modal.state';
import toast from 'react-hot-toast';
import ProjectCreateLoader from '@/shared/ui/ProjectCreateLoader';
import Download from '@/shared/icons/Download';

const columns = [
  '',
  'Variant Name',
  'Camera Position',
  'Camera Configuration',
  'Objective',
  'Dataset',
  'Annotation Status',
  'Download Annotations'
];

export default function Annotation() {
  const params = useParams();
  const [selectedConfiguration, setSelectedConfiguration] = useRecoilState(selectedConfigurationAtom)
  const [configurations, setConfigurations] = React.useState([]);
  const [selectedDataset, setSelectedDataset] = React.useState(null);
  const [loader, setLoader] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [warningIndex, setWarningIndex] = React.useState(null);
  const [open, setOpen] = useRecoilState(modalAtom);
  const location = useLocation();
  const navigate = useNavigate();

  // const [configurations, setConfigurations] = React.useState([
  //   { id: 1, status: 'Pending' },
  //   { id: 2, status: 'Complete' },
  // ]);

  const getConfigurations = async () => {
    try {
      const res = await axiosInstance.get('/annotation/list', {
        params: {
          projectId: params.projectId,
        },
      });
      setConfigurations(res.data.data)
    } catch (error) {
      toast.error(error?.response?.data?.data?.message)
    }
  }

  const downloadAnnotations = async (folderId) => {
    try {
      setLoader(true);
      const apiUrl = `${import.meta.env.VITE_BASE_API_URL}/dataset/download?folderId=${folderId}`;
  
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          // Add any necessary headers here, e.g., authorization
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // Get the filename from the Content-Disposition header if available
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `${folderId}.zip`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file', error);
      // Handle the error appropriately, e.g., show a user-friendly message
    } finally {
      setLoader(false);
    }
  };

  const getImagesFromDataset = async () => {
    try {
      setLoader(true);
      const response = await axiosInstance.get('/dataset/allImages', {
        params: {
          folderId: selectedDataset
        }
      });

      const images = await response?.data?.data;
      return images.length > 0;
    } catch(error) {
      toast.error(error?.response?.data?.data?.message)
    } finally {
      setLoader(false);
    }
  }

  const startConfiguration = async () => {
    const status = selectedConfiguration.status.toLocaleLowerCase();
    if(!selectedDataset){
      setWarningIndex(0);
      setOpen(true);
      return;
    }else{
      const hasImages = await getImagesFromDataset();
      if(!hasImages){
        setWarningIndex(1);
        setOpen(true);
        return;
      }
    }
    
      navigate(`annotation-job/${selectedConfiguration.id}/${selectedDataset}`, {state: {...location.state}})
  }

  React.useEffect(() => {
    setSelectedConfiguration({
      id: '',
      objective: 'Assembly',
      status: '',
      analysisStatus: ''
    })
    getConfigurations();

    return () => setOpen(false);
  }, [])
  return (
    <>
      <Modal>
        <WarningModal 
          warningIndex = {warningIndex}
          configId = {selectedConfiguration.id}
          config = {selectedConfiguration}
        />
      </Modal>

      {loader && (
        <ProjectCreateLoader title='Fetching dataset details'/>
      )}

      <Heading
        subcontent={
          <>
            <Link
              to={`/annotation/${params.projectId}`}
              className="flex items-center gap-2"
              state={location.state}
            >
              <ArrowRight />
              <span>{location.state?.projectName}</span>
            </Link>
          </>
        }
      >
        <Link to="/" className="mb-8">
          Project
        </Link>
      </Heading>

      <div className="p-10">
        <div className="mb-8 flex items-center justify-between">
          <h1 className=" text-2xl font-semibold">Annotation</h1>
          <div 
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Button 
              fullWidth={false} 
              size="xs" 
              className="flex items-center gap-2" 
              disabled={!selectedConfiguration.id || selectedConfiguration?.status?.toLowerCase() === 'pending'}
              onClick={startConfiguration}
            >
              <Setting />
              Start Annotation
            </Button>
            {isHovered && (selectedConfiguration?.status?.toLowerCase() === 'pending') && (
              <div className="w-[200px] absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-black text-white py-2 px-4 rounded-md text-sm z-10">
                Please complete the configuration for this in previous step.
              </div>
            )}
          </div>
        </div>

        <div className="placeholder:*: relative shadow-md sm:rounded-lg">
          <table className="w-full text-left text-sm text-gray-500 rtl:text-right ">
            <thead className="bg-white text-sm uppercase text-gray-700 ">
              <tr>
                {columns.map((t, index) => (
                  <th scope="col" className={`px-6 py-3 ${index===columns.length-1?"text-right":""}`} key={t}>
                    {t}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {configurations.map((config, index) => {
                return (
                  <tr
                    className="odd:bg-white even:bg-[#C6C4FF]/10"
                    key={config.id}
                  >
                    <th
                      scope="row"
                      className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 "
                    >
                      <Radio
                        value="stationary"
                        name="isItemFixed"
                        id="stationary"
                        checked={selectedConfiguration.id===config.id && config.datasetId==selectedDataset}
                        onClick={(e) => {
                          setSelectedDataset(config.datasetId);
                          setSelectedConfiguration(config)
                        }}
                      />
                    </th>
                    <td className="px-6 py-4">{config.variant}</td>
                    <td className="px-6 py-4">{config.cameraPosition}</td>
                    <td className="px-6 py-4">{config.cameraConfig}</td>
                    <td className="px-6 py-4">{config.objective}</td>
                    <td className="px-6 py-4">{config.datasetName}</td>
                    <td className="px-6 py-4">
                      {config.count && <span>
                          <b className='flex justify-center'>{config.annotated} / {config.count}</b>
                        </span>
                      }
                    </td>
                    <td className="px-6 py-4">
                      <div 
                        onClick={() => {
                          if(parseInt(config.annotated) === parseInt(config.count)) downloadAnnotations(config.datasetId)
                        }}
                        className={`${parseInt(config.annotated) === parseInt(config.count) ? "cursor-pointer" : ""} text-right w-10 ml-auto`}
                      >
                        <Download 
                          disabled={parseInt(config.annotated) !== parseInt(config.count)}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
