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

const columns = [
  '',
  'Variant Name',
  'Camera Position',
  'Camera Configuration',
  'Objective',
  'Dataset',
  'Annotation Status',
];

export default function Annotation() {
  const params = useParams();
  const [selectedConfiguration, setSelectedConfiguration] = useRecoilState(selectedConfigurationAtom)
  const [configurations, setConfigurations] = React.useState([]);
  const [selectedDataset, setSelectedDataset] = React.useState(null);
  const [loader, setLoader] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [description, setDescription] = React.useState('');
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
    if(!selectedDataset){
      setDescription(`
        Please, first, create a dataset folder for this camera configuration from the Build flow of this project. 
        Then, upload the positive & negative images in this newly created dataset folder for this configuration according to the below pre-training analysis result for this camera configuration.`
      );
      setOpen(true);
      return;
    }else{
      const hasImages = await getImagesFromDataset();
      if(!hasImages){
        setDescription(`
          Please upload the positive & negative images in the mentioned dataset folder, within the table column Dataset, for this configuration according to the below pre-training analysis result for this camera configuration.
        `);
        setOpen(true);
        return;
      }
    }
    navigate(`annotation-job/${selectedConfiguration.id}/${selectedDataset}`)
  }

  React.useEffect(() => {
    setSelectedConfiguration({
      id: '',
      objective: 'Assembly',
      status: ''
    })
    getConfigurations();
  }, [])
  return (
    <>
      <Modal>
        <WarningModal 
          description = {description}
          configId = {selectedConfiguration.id}
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
                {columns.map((t) => (
                  <th scope="col" className="px-6 py-3" key={t}>
                    {t}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {configurations.map((config, index) => {
                return (
                  <tr
                    className="border-b odd:bg-white even:bg-[#C6C4FF]/10"
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
                          setSelectedConfiguration({
                            id: config.id,
                            objective: config.objective,
                            status: config.status
                          })
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
