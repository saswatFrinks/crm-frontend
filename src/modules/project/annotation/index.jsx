import axiosInstance from '@/core/request/aixosinstance';
import ArrowRight from '@/shared/icons/ArrowRight';
import Setting from '@/shared/icons/Setting';
import Heading from '@/shared/layouts/main/heading';
import Button from '@/shared/ui/Button';
import Radio from '@/shared/ui/Radio';
import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { assemblyAtom } from '../state';
import { selectedConfigurationAtom } from '../project-configuration/state';

const columns = [
  '',
  'Variant Name',
  'Camera Position',
  'Camera Configuration',
  'Objective',
  'Dataset',
  'Annotated Images',
];

export default function Annotation() {
  const params = useParams();
  const [selectedConfiguration, setSelectedConfiguration] = useRecoilState(selectedConfigurationAtom)
  const [configurations, setConfigurations] = React.useState([]);
  const [selectedDataset, setSelectedDataset] = React.useState(null);
  const [configurationStatus, setConfigurationStatus] = React.useState(false);
  const location = useLocation();

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
      
    }
  }

  React.useEffect(() => {
    getConfigurations();
  }, [])
  return (
    <>
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
          <Button fullWidth={false} size="xs" className={selectedConfiguration.id && selectedDataset && configurationStatus?'': 'bg-gray-500 hover:bg-gray-400'}>
            {(selectedConfiguration.id && selectedDataset && configurationStatus) ? (
              <Link className="flex items-center gap-2" to={`annotation-job/${selectedConfiguration.id}/${selectedDataset}`}>
                <Setting />
                Start Annotation
              </Link>
            ) : (
              
              <div className="flex items-center gap-2 relative group">
                <div className="absolute bottom-full mb-2 hidden group-hover:inline-block right-[-10px] bottom-[25px]" style={{maxWidth: '200%'}}>
                  <div className="bg-orange-100 text-black text-sm py-2 px-4 rounded">
                    {!selectedDataset ?  'Select a variant' : configurationStatus ?'Please create a dataset and upload images to continue': 'Complete project configuration to continue'}
                  </div>
                  <div className="absolute rotate-180 left-1/2 transform -translate-x-1/2 -bottom-[1.5] w-0 h-0 border-x-8 border-x-transparent border-b-8 border-b-orange-100"></div>
                </div>
                <Setting />
                Start Annotation
              </div>
            )}
          </Button>
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
                          setConfigurationStatus(config.status=='Complete')
                          setSelectedConfiguration({
                            id: config.id,
                            objective: config.objective
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
                      {config.count && <span
                          className={`${config.annotated != config.count ? 'text-red-500' : 'text-green-500'}`}
                        >
                          {config.annotated == config.count ? 'Completed': 'Incomplete'}: &nbsp;&nbsp;<b>{config.annotated} / {config.count}</b>
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
