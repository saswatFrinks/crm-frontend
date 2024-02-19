import ArrowRight from '@/shared/icons/ArrowRight';
import Setting from '@/shared/icons/Setting';
import Heading from '@/shared/layouts/main/heading';
import Button from '@/shared/ui/Button';
import Radio from '@/shared/ui/Radio';
import React from 'react';
import { Link, useParams } from 'react-router-dom';

const columns = [
  '',
  'Variant Name',
  'Camera Position',
  'Camera Configuration',
  'Objective',
  'Configuration Status',
];

export default function ProjectConfiguration() {
  const params = useParams();

  const [configurations, setConfigurations] = React.useState([
    { id: 1, status: 'Pending' },
    { id: 2, status: 'Complete' },
  ]);

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
          <Button fullWidth={false} size="xs">
            <Link className="flex items-center gap-2" to={`assembly`}>
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
              {configurations.map((plant, index) => {
                return (
                  <tr
                    className="border-b odd:bg-white even:bg-[#C6C4FF]/10"
                    key={plant.id}
                  >
                    <th
                      scope="row"
                      className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 "
                    >
                      <Radio
                        value="stationary"
                        name="isItemFixed"
                        id="stationary"
                        checked={false}
                        onChange={(e) => console.log(e.target.checked)}
                      />
                    </th>
                    <td className="px-6 py-4">Name</td>
                    <td className="px-6 py-4">Position</td>
                    <td className="px-6 py-4">Configuration</td>
                    <td className="px-6 py-4">Objective</td>
                    <td className="px-6 py-4">
                      <span
                        className={`${plant.status == 'Pending' ? 'text-red-500' : 'text-green-500'}`}
                      >
                        {plant.status}
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