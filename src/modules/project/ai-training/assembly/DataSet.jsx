import ArrowUp from '@/shared/icons/ArrowUp';
import Checkbox from '@/shared/ui/Checkbox';
import Label from '@/shared/ui/Label';
import React, { useState } from 'react';
import { ChevronUp } from 'react-feather';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { configurationAtom, datasetAtom } from './state';
import axiosInstance from '@/core/request/aixosinstance';
import toast from 'react-hot-toast';
import { modalAtom } from '@/shared/states/modal.state';
import Modal from '@/shared/ui/Modal';
import ErrorModal from '@/shared/ui/ErrorModal';

export default function DataSet({ setLoading, formRef }) {
  const configuration = useRecoilValue(configurationAtom).filter(
    (obj) => obj.check
  );

  const [folders, setFolders] = useState([]);
  const [dataset, setDataSet] = useRecoilState(datasetAtom);
  const [error, setError] = useState('');
  const [openModal, setOpenModal] = useRecoilState(modalAtom);

  const fetchAllFolders = async () => {
    setLoading(true);
    try {
      console.log('configuration:', configuration);
      const newFolders = await Promise.all(
        configuration.map(async (config) => {
          const res = await axiosInstance.get('/dataset/folders', {
            params: {
              cameraConfigId: config.cameraConfig.id,
            },
          });

          const folders = await Promise.all(
            res.data.data.map(async (data) => {
              const res = await axiosInstance.get('/dataset/allImages', {
                params: {
                  folderId: data.id,
                },
              });
              let flag = true;
              let annotatedCount = 0;
              res.data.data.map((image) => {
                if (!image.annotated) {
                  flag = false;
                }else{
                  annotatedCount += 1;
                }
              });
              return {
                id: data.id,
                folderName: data.name,
                totalImages: res.data.data.length,
                annotatedImages: annotatedCount,
                annotated: flag,
                check: false,
              };
            })
          );

          return { ...config, folders, open: true };
        })
      );
      // if (dataset.length != 0) {
      //   setFolders(newFolders);
      // } else {
      if(dataset?.length === 0){
        setFolders(newFolders);
        setDataSet(newFolders);
      }else{
        setFolders(dataset);
      }
      // }
      setLoading(false);
    } catch (e) {
      toast.error(e?.response?.data?.data?.message);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAllFolders();

    return () => setOpenModal(false);
  }, []);

  // const columns = ['Variant 1', 'CP1', 'CC1'];

  // const [list, setList] = React.useState([
  //   {
  //     id: 1,
  //     open: true,
  //   },
  //   {
  //     id: 2,
  //     open: true,
  //   },
  // ]);

  const toggle = (id) => {
    const newFolders = folders.map((folder) => {
      if (folder.roi.id === id) {
        return { ...folder, open: !folder.open };
      }

      return folder;
    });

    setFolders(newFolders);
  };

  const handleCheckboxChange = (id, index) => {
    const newFolders = folders.map((folder) => {
      if (folder.roi.id === id) {
        const updatedFolder = {
          ...folder,
          folders: folder.folders.map((innerFolder, innerIndex) => {
            if (innerIndex === index) {
              return {
                ...innerFolder,
                check: !innerFolder.check,
              };
            }
            return innerFolder;
          }),
        };

        return updatedFolder;
      }

      return folder;
    });

    setFolders(newFolders);
    setDataSet(newFolders);
  };

  const showError = (error) => {
    setError(error);
    setOpenModal(true);
  }

  const validate = () => {
    let flag = true;
    folders.forEach(folder => {
      if(!folder?.folders?.some(fol => fol.check)){
        flag = false;
      }
    })
    if(!flag){
      showError('Please select at least 1 dataset folder for each of the configurations to be able to proceed to next step');
      return false;
    }else{
      folders.forEach(folder => {
        folder?.folders?.forEach(selectedFolder => {
          if(selectedFolder?.check === true && !selectedFolder?.annotated){
            flag = false;
          }
        })
      })
      if(!flag){
        showError('Please annotate all of the images present in the selected dataset folders to be able to proceed to next step');
        return false;
      }
    }
    return true;
  }

  const handleSubmit = () => {
    return validate();
  }

  formRef.current = {handleSubmit}
  console.log({folders})

  return (
    <div className="flex flex-col gap-8">
      <Modal>
        <ErrorModal
          error={error}
        />
      </Modal>
      <h3 className=" text-2xl font-semibold">Datasets</h3>
      <p>
        Select the dataset folders to be used for training this AI model. We
        recommend at least <span className="font-semibold">200 images</span> for
        good training results of this project.
      </p>

      <div>
        <div className='text-lg font-medium text-right'>Annotated Images</div>
        {folders.map((k) => (
          <div
            key={k.roi.id}
            className="placeholder:*: relative  py-2 odd:border-t-[1px] sm:rounded-lg"
          >
            <table className="w-full text-left text-sm text-gray-500  ">
              <thead className="bg-white text-sm uppercase text-gray-700 ">
                <tr>
                  <th scope="col" key={1} className="w-1/3">
                    <div className="flex select-none items-center gap-2 px-2">
                      <ChevronUp
                        size={20}
                        onClick={() => toggle(k.roi.id)}
                        className={`cursor-pointer duration-75 ${k.open ? '' : 'rotate-180'}`}
                      />
                      <span>{k.variant.name}</span>
                    </div>
                  </th>
                  <th scope="col" key={2} className="w-1/3">
                    <div className="flex select-none items-center gap-2 px-2">
                      <span>{k.capturePosition.name}</span>
                    </div>
                  </th>
                  <th scope="col" key={3} className="w-1/3">
                    <div className="flex select-none items-center gap-2 px-2">
                      <span>{k.cameraConfig.name}</span>
                    </div>
                  </th>
                </tr>
              </thead>
              {k.open ? (
                <tbody>
                  {k.folders.map((folder, index) => {
                    console.log({check: folder.check, folders})
                    return (
                      <tr className="border-b " key={folder.id}>
                        <th
                          scope="row"
                          className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 "
                        >
                          <div className="flex gap-2">
                            <Checkbox
                              id="class"
                              checked={folder.check}
                              onChange={() => {}}
                              className="cursor-pointer"
                              onClick={() => {
                                handleCheckboxChange(k.roi.id, index);
                              }}
                            />
                            <Label htmlFor="class1" main={false}>
                              {folder.folderName}
                            </Label>
                          </div>
                        </th>
                        <td className="px-6 py-4"></td>
                        <td
                          className={`py-4m px-6 text-${folder.annotated ? 'green' : 'red'}-500`}
                        ></td>
                        <td
                          className={`py-4m px-10 font-medium text-${folder.annotated ? 'green' : 'red'}-500`}
                        >
                          {`${folder?.annotatedImages}/${folder?.totalImages}`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              ) : null}
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
