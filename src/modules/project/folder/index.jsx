import axiosInstance from '@/core/request/aixosinstance';
import Action from '@/modules/team-user/Action';
import ArrowRight from '@/shared/icons/ArrowRight';
import Upload from '@/shared/icons/Upload';
import Heading from '@/shared/layouts/main/heading';
import { modalAtom } from '@/shared/states/modal.state';
import InputFile from '@/shared/ui/InputFile';
import React, { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

export default function Folder() {
  const columns = ['S.No.', 'File Name', 'Date Created'];
  const setModalState = useSetRecoilState(modalAtom);
  const params = useParams();
  const { pathname } = useLocation();
  const [datasetImages, setDatasetImages] = useState([]);

  async function handleFileUpload(event) {
    const files = event.target.files;
    const formData = new FormData();
    const folderId = pathname.split('/')[10];

    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    formData.append('folderId', '47720812-8e76-4835-b12a-a9f47cbe89e9');

    await axiosInstance.post('/dataset/upload', formData);
    fetchAllImages();
  }

  const fetchAllImages = async () => {
    const res = await axiosInstance.get('/dataset/allImages', {
      params: {
        folderId: '47720812-8e76-4835-b12a-a9f47cbe89e9',
      },
    });

    setDatasetImages(res.data.data);
  };

  React.useEffect(() => {
    fetchAllImages();
  }, []);

  const handleOpenModal = () => {
    setModalState(true);
  };
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
            <Link
              to={`/project/${params.projectId}/variant/${params.variantId}`}
              className="flex items-center gap-2"
            >
              <ArrowRight />
              <span>Variant Name</span>
            </Link>

            <Link
              to={`/project/${params.projectId}/variant/${params.variantId}/camera-position/${params.cameraPositionId}`}
              className="flex items-center gap-2"
            >
              <ArrowRight />
              <span>Camera Position</span>
            </Link>

            <Link
              to={`/project/${params.projectId}/variant/${params.variantId}/camera-position/${params.cameraPositionId}/camera-config/${params.cameraConfigId}`}
              className="flex items-center gap-2"
            >
              <ArrowRight />
              <span>Camera Config</span>
            </Link>
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
            <Upload />
            Upload Data
            <input
              type="file"
              multiple
              hidden
              id="file"
              onChange={handleFileUpload}
            />
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
              {datasetImages?.map((datasetImage, index) => {
                return (
                  <tr
                    key={index}
                    className="border-b odd:bg-white even:bg-[#C6C4FF]/10"
                  >
                    <th
                      scope="row"
                      className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 "
                    >
                      {index + 1}
                    </th>
                    <td className="px-6 py-4">{datasetImage.name}</td>
                    <td className="px-6 py-4">
                      {new Date(
                        Number(datasetImage.createdAt)
                      ).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4">
                      <Action handleOpenModal={handleOpenModal} />
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
