import Action from '@/modules/team-user/Action';
import ArrowRight from '@/shared/icons/ArrowRight';
import Heading from '@/shared/layouts/main/heading';
import { modalAtom } from '@/shared/states/modal.state';
import InputFile from '@/shared/ui/InputFile';
import React from 'react';
import { useSetRecoilState } from 'recoil';

export default function Folder() {
  const columns = ['S.No.', 'File Name', 'Date Created'];
  const setModalState = useSetRecoilState(modalAtom);

  const handleOpenModal = () => {
    setModalState(true);
  };
  return (
    <>
      <Heading
        subcontent={
          <>
            <ArrowRight />
            <span>Project Name</span>
            <ArrowRight />
            <span>Variant Name</span>
            <ArrowRight />
            <span>Camera Position</span>
            <ArrowRight />
            <span>Camera Config</span>
            <ArrowRight />
            <span>Folder Name</span>
          </>
        }
      >
        Project
      </Heading>

      <div className="p-10">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Data</h1>

          <label
            htmlFor="file"
            className="flex cursor-pointer items-center gap-2 rounded-full bg-f-primary px-4 py-1.5 text-white  hover:bg-f-secondary"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 9V11.6667C13 12.0203 12.8595 12.3594 12.6095 12.6095C12.3594 12.8595 12.0203 13 11.6667 13H2.33333C1.97971 13 1.64057 12.8595 1.39052 12.6095C1.14048 12.3594 1 12.0203 1 11.6667V9M10.3333 4.33333L7 1M7 1L3.66667 4.33333M7 1V9"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Upload Data
            <input type="file" hidden id="file" />
          </label>
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

                <th scope="col" className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b odd:bg-white even:bg-[#C6C4FF]/10">
                <th
                  scope="row"
                  className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 "
                >
                  Apple MacBook Pro 17
                </th>
                <td className="px-6 py-4">Silver</td>
                <td className="px-6 py-4">Silver</td>

                <td className="px-6 py-4">
                  <Action handleOpenModal={handleOpenModal} />
                </td>
              </tr>
              <tr className="border-b odd:bg-white even:bg-[#C6C4FF]/10 ">
                <th
                  scope="row"
                  className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 "
                >
                  Apple MacBook Pro 17
                </th>{' '}
                <td className="px-6 py-4">Silver</td>
                <td className="px-6 py-4">Silver</td>
                <td className="px-6 py-4">
                  <Action handleOpenModal={handleOpenModal} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
