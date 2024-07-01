import axiosInstance from '@/core/request/aixosinstance';
import Action from '@/modules/team-user/Action';
import ArrowRight from '@/shared/icons/ArrowRight';
import Trash from '@/shared/icons/Trash';
import Upload from '@/shared/icons/Upload';
import Heading from '@/shared/layouts/main/heading';
import { modalAtom } from '@/shared/states/modal.state';
import Checkbox from '@/shared/ui/Checkbox';
import ProjectCreateLoader from '@/shared/ui/ProjectCreateLoader';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

export default function Folder() {
  const columns = ['', 'S.No.', 'File Name', 'Date Created', 'Is Annotated'];
  const setModalState = useSetRecoilState(modalAtom);
  const params = useParams();
  const [datasetImages, setDatasetImages] = useState([]);
  const [id, setId] = useState('');
  const location = useLocation();
  const [loader, setLoader] = useState(false);
  const [loaderTitle, setLoaderTitle] = useState('');
  const [deleteIds, setDeleteIds] = useState([]);

  async function handleFileUpload(event) {
    try {
      const files = event.target.files;
      const totalFiles = files.length;
      const batchSize = 10;
      let start = 0;

      const checkFiles = Array.from(files);
      const allFilesArePNG = checkFiles.every(
        (file) => file.type === 'image/png'
      );

      if (!allFilesArePNG) {
        toast.error('Please select only PNG images');
        return;
      }

      setLoader(true);

      while (start < totalFiles) {
        const end = Math.min(start + batchSize, totalFiles);
        const batch = [];

        for (let i = start; i < end; i++) {
          batch.push(files[i]);
        }

        const formData = new FormData();
        batch.forEach((file) => {
          formData.append('files', file);
        });
        formData.append('folderId', params.folderId);

        setLoaderTitle(`Uploading (${end}/${totalFiles})`);

        await axiosInstance.post('/dataset/upload', formData);
        await fetchAllImages();

        start += batchSize;
      }
    } catch (error) {
      toast.error(error.response.data.data.message);
    } finally {
      setLoader(false);
    }
  }

  const fetchAllImages = async () => {
    const res = await axiosInstance.get('/dataset/allImages', {
      params: {
        folderId: params.folderId,
      },
    });

    setDatasetImages(res.data.data);
  };

  React.useEffect(() => {
    fetchAllImages();

    return () => setModalState(false);
  }, []);

  const handleOpenModal = () => {
    setModalState(true);
  };

  const deleteImageById = async (imageId) => {
    await axiosInstance.delete('/dataset/image', {
      params: {
        folderId: params.folderId,
        imageId,
      },
    });
    setDeleteIds((prev) => [...prev].filter((i) => i !== imageId));

    fetchAllImages();
  };

  const deleteMultipleImages = async () => {
    try {
      setLoader(true);
      setLoaderTitle('Deleting selected images...');
      const deletePromises = deleteIds.map((imageId) =>
        axiosInstance.delete('/dataset/image', {
          params: {
            folderId: params.folderId,
            imageId,
          },
        })
      );
      await Promise.all(deletePromises);
      toast.success('Selected images deleted successfully');
      setDeleteIds([]);
      fetchAllImages();
    } catch (error) {
      toast.error('An error occurred while deleting images');
    } finally {
      setLoader(false);
    }
  };

  const getImageUrl = (imageId) => {
    const baseUrl = import.meta.env.VITE_BASE_API_URL;
    return `${baseUrl}/dataset/image?imageId=${imageId}`;
  };

  return (
    <>
      <Heading
        subcontent={
          <>
            <Link
              to={`/project/${params.projectId}`}
              className="flex items-center gap-2"
              state={location.state}
            >
              <ArrowRight />
              <span>{location.state.projectName}</span>
            </Link>
            <Link
              to={`/project/${params.projectId}/variant/${params.variantId}`}
              className="flex items-center gap-2"
              state={location.state}
            >
              <ArrowRight />
              <span>{location.state.variantName}</span>
            </Link>

            <Link
              to={`/project/${params.projectId}/variant/${params.variantId}/camera-position/${params.cameraPositionId}`}
              className="flex items-center gap-2"
              state={location.state}
            >
              <ArrowRight />
              <span>{location.state.cameraPositionName}</span>
            </Link>

            <Link
              to={`/project/${params.projectId}/variant/${params.variantId}/camera-position/${params.cameraPositionId}/camera-config/${params.cameraConfigId}`}
              className="flex items-center gap-2"
              state={location.state}
            >
              <ArrowRight />
              <span>{location.state.cameraConfigName}</span>
            </Link>
            <ArrowRight />
            <span>{location.state.folderName}</span>
          </>
        }
      >
        <Link to="/" className="mb-8">
          Project
        </Link>
      </Heading>

      <div className="p-10">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Data</h1>

          <div className="flex items-center gap-4">
            {deleteIds.length > 0 && (
              <span
                className="flex cursor-pointer items-center gap-2 rounded-full bg-f-primary px-4 py-1.5 text-white  hover:bg-f-secondary"
                onClick={deleteMultipleImages}
              >
                <Trash color={'#fff'} />
                Delete Image{deleteIds.length > 1 ? 's' : ''}
              </span>
            )}
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
                accept=".png"
                onChange={handleFileUpload}
              />
            </label>
          </div>
        </div>

        <div className="placeholder:*: relative shadow-md sm:rounded-lg">
          <table className="w-full text-left text-sm text-gray-500 rtl:text-right ">
            <thead className="bg-white text-sm text-gray-700 ">
              <tr>
                {columns.map((t) => {
                  if(t === '' && datasetImages.length){
                    return <div className="px-4 py-3">
                      <Checkbox
                        checked={datasetImages.length && deleteIds.length == datasetImages.length}
                        onChange={() => {
                          setDeleteIds(deleteIds.length == datasetImages.length ? [] : datasetImages.map(img => img.id));
                        }}
                      />
                    </div>
                  }
                  return (
                    <th scope="col" className="px-6 py-3 uppercase" key={t}>
                      {t}
                    </th>
                  );
                })}

                <th scope="col" className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {datasetImages.map((datasetImage, index) => {
                return (
                  <tr
                    key={index}
                    className="border-b odd:bg-white even:bg-[#C6C4FF]/10"
                  >
                    <th
                      scope="row"
                      className="whitespace-nowrap p-4 font-medium text-gray-900 "
                    >
                      <Checkbox
                        checked={deleteIds.includes(datasetImage.id)}
                        onChange={() => {
                          setDeleteIds((prev) => {
                            const newPrev = [...prev];
                            if (newPrev.includes(datasetImage.id))
                              return newPrev.filter(
                                (i) => i !== datasetImage.id
                              );
                            else newPrev.push(datasetImage.id);
                            return newPrev;
                          });
                        }}
                      />
                    </th>
                    <th
                      scope="row"
                      className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 "
                    >
                      {index + 1}
                    </th>
                    <td className="px-6 py-4">
                      <a href={getImageUrl(datasetImage.id)} target="_blank">
                        {datasetImage.name}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(
                        Number(datasetImage.createdAt)
                      ).toLocaleString()}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium">
                      {datasetImage?.annotated ? 'True' : 'False'}
                    </td>

                    <td className="px-6 py-4">
                      <Action
                        handleOpenModal={handleOpenModal}
                        id={datasetImage.id}
                        setId={setId}
                        deleteImageById={deleteImageById}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {loader && <ProjectCreateLoader title={loaderTitle} />}
          </table>
        </div>
      </div>
    </>
  );
}
