import Button from '@/shared/ui/Button';
import Chip from '@/shared/ui/Chip';
import Drawer from '@/shared/ui/Drawer';
import React from 'react';
import { FaPlus } from 'react-icons/fa';
import BuildNTrainDrawer from './BuildNTrainDrawer';

export default function Assembly() {
  const [open, setOpenDrawer] = React.useState(false);

  const columns = [
    'Model Name',
    'Date Created',
    'Training Data',
    'Training Status',
    'Classes',
  ];

  const statusObj = {
    success: 'text-green-500',
    failed: 'text-red-500',
    'in-progress': 'text-yellow-500',
  };

  const closeDrawer = () => {
    setOpenDrawer(false);
  };

  const openDrawer = () => {
    setOpenDrawer(true);
  };

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">AI Models</h1>
        <Button fullWidth={false} size="xs" onClick={openDrawer}>
          <div className="flex items-center gap-2">
            <FaPlus />
            Build & Train an AI Model
          </div>
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
            {Array(10)
              .fill(1)
              .map((plant) => {
                return (
                  <tr
                    className="border-b odd:bg-white even:bg-[#C6C4FF]/10"
                    key={plant.id}
                  >
                    <th
                      scope="row"
                      className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 "
                    >
                      -
                    </th>
                    <td className="px-6 py-4">-</td>
                    <td className="px-6 py-4">-</td>
                    <td className={`px-6 py-4 ${statusObj['success']}`}>-</td>
                    <td className="flex flex-wrap gap-2 px-6 py-4">
                      <Chip>Class 1</Chip>
                      <Chip>Class 2</Chip>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <Drawer
        isOpen={open}
        handleClose={closeDrawer}
        title="Build and Train AI model"
        size="7xl"
        footer={
          <div className="grid w-full grid-cols-12">
            <div className="col-span-8 col-start-5 flex items-center justify-between gap-4">
              <Button
                size="xs"
                fullWidth={false}
                className="min-w-[150px]"
                //   onClick={() => ref.current?.submitForm()}
              >
                Next
              </Button>

              <Button
                size="xs"
                variant="flat"
                fullWidth={false}
                className="min-w-[150px]"
                onClick={closeDrawer}
              >
                Cancel
              </Button>
            </div>
          </div>
        }
      >
        <BuildNTrainDrawer />
      </Drawer>
    </>
  );
}
