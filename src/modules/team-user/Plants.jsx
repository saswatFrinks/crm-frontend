import Button from '@/shared/ui/Button';
import React from 'react';
import { FaPlus } from 'react-icons/fa6';
import { HiDotsVertical } from 'react-icons/hi';
import Action from './Action';

export default function Plants() {
  const columns = ['Plant Name', 'Location'];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Plants</h1>
        <Button fullWidth={false} size="xs">
          <div className="flex items-center gap-2">
            <FaPlus />
            Add plant
          </div>
        </Button>
      </div>

      <div className="relative placeholder:*: shadow-md sm:rounded-lg">
        <table className="w-full text-left text-sm text-gray-500 rtl:text-right ">
          <thead className="bg-white text-xs uppercase text-gray-700 ">
            <tr>
              {columns.map((t) => (
                <th scope="col" className="px-6 py-3" key={t}>
                  {t}
                </th>
              ))}

              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b odd:bg-white even:bg-gray-50  ">
              <th
                scope="row"
                className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 "
              >
                Apple MacBook Pro 17
              </th>
              <td className="px-6 py-4">Silver</td>
              <td className="px-6 py-4">
                <Action />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
