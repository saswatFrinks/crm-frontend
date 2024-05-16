import axiosInstance from '@/core/request/aixosinstance';
import ArrowRight from '@/shared/icons/ArrowRight';
import Setting from '@/shared/icons/Setting';
import Heading from '@/shared/layouts/main/heading';
import Button from '@/shared/ui/Button';
import Radio from '@/shared/ui/Radio';
import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { selectedConfigurationAtom } from './state';
import { rectanglesAtom } from '../state';
import { stepAtom } from '../assembly/state';

const columns = [
  '',
  'Variant Name',
  'Camera Position',
  'Camera Configuration',
  'Objective',
  'Configuration Status',
  'Pre-training Analysis',
];

const preAnalysisStatusMap=[{color:"red",label:"Result Unavailable",}
  ,"Started Analyzing","In Progress","View Latest Result","Result Unavailable"
]

export default function ProjectConfiguration() {
  const params = useParams();

  const [configurations, setConfigurations] = React.useState([
  ]);
  const setRectangles = useSetRecoilState(rectanglesAtom)
  const setSteps = useSetRecoilState(stepAtom)

  const [selectedConfiguration, setSelectedConfiguration] = useRecoilState(selectedConfigurationAtom)

  const getConfigurations = async () => {
    try {
      const res = await axiosInstance.get('/configuration/list', {
        params: {
          projectId: params.projectId,
        },
      });
      setConfigurations(res.data.data)
    } catch (error) {
      
    }
  }

  useEffect(()=>{
    getConfigurations()
    setRectangles([]);
    setSteps(0);
  }, [])

  return (
    <>
      <Heading
        subcontent={
          <>
            <Link
              to={`/project/${params.projectId}`}
              className="flex items-center gap-2"
            >
              <ArrowRight />
              <span>Project Name</span>
            </Link>
          </>
        }
      >
        Project
      </Heading>

      <div className="p-10">
        <div className="mb-8 flex items-center justify-between">
          <h1 className=" text-2xl font-semibold">Project Configuration</h1>
          <Button fullWidth={false} size="xs" disabled={selectedConfiguration.id === ""}>
            <Link className="flex items-center gap-2" to={`${selectedConfiguration.objective.toLowerCase()}/${selectedConfiguration.id}`}>
              <Setting />
              Start Configuration
            </Link>
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
                        checked={selectedConfiguration.id===config.id}
                        onClick={(e) => {
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
                    <td className="px-6 py-4">
                      <span
                        className={`${config.status == 'Pending' ? 'text-red-500' : 'text-green-500'}`}
                      >
                        {config.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`${config.status == 'Pending' ? 'text-red-500' : 'text-green-500'}`}
                      >
                        {config.analysisStatus}
                      </span>
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