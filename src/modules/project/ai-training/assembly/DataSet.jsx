import ArrowUp from '@/shared/icons/ArrowUp';
import Checkbox from '@/shared/ui/Checkbox';
import Label from '@/shared/ui/Label';
import React, { useState } from 'react';
import { ChevronUp } from 'react-feather';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { configurationAtom, datasetAtom } from './state';
import axiosInstance from '@/core/request/aixosinstance';

export default function DataSet() {
  const configuration = useRecoilValue(configurationAtom).filter(
    (obj) => obj.check
  );

  const [folders, setFolders] = useState([]);
  const setDataSet = useSetRecoilState(datasetAtom);

  const fetchAllFolders = async () => {
    const newFolders = await Promise.all(
      configuration.map(async (config) => {
        const res = await axiosInstance.get('/dataset/folders', {
          params: {
            cameraConfigId: config.cameraConfigId,
          },
        });

        const folders = await Promise.all(
          res.data.data.map(async (data) => {
            const res = await axiosInstance.get('/dataset/allImages', {
              params: {
                folderId: data.id,
              },
            });

            return {
              folderName: data.name,
              totalImages: res.data.data.length,
              check: false,
            };
          })
        );

        return { ...config, folders, open: true };
      })
    );
    setFolders(newFolders);
    setDataSet(newFolders);
  };

  React.useEffect(() => {
    fetchAllFolders();
  }, []);
  const columns = ['Variant 1', 'CP1', 'CC1'];

  const [list, setList] = React.useState([
    {
      id: 1,
      open: true,
    },
    {
      id: 2,
      open: true,
    },
  ]);

  const toggle = (id) => {
    // setList((t) =>
    //   t.map((k) => ({
    //     ...k,
    //     open: k.id == id ? !k.open : k.open,
    //   }))
    // );
    const newFolders = folders.map((folder) => {
      if (folder.id === id) {
        return { ...folder, open: !folder.open };
      }

      return folder;
    });

    setFolders(newFolders);
  };

  const handleCheckboxChange = (id, index) => {
    const newFolders = folders.map((folder) => {
      if (folder.id === id) {
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

  //console.log(list);

  return (
    <div className="flex flex-col gap-8">
      <h3 className=" text-2xl font-semibold">Datasets</h3>
      <p>
        Select the dataset folders to be used for training this AI model. We
        recommend at least <span className="font-semibold">200 images</span> for
        good training results of this project.
      </p>

      {/* <div>
        {fol.map((k) => (
          <div
            key={k.id}
            className="placeholder:*: relative  py-2 odd:border-t-[1px] sm:rounded-lg"
          >
            <table className="w-full text-left text-sm text-gray-500  ">
              <thead className="bg-white text-sm uppercase text-gray-700 ">
                <tr>
                  {columns.map((t, i) => (
                    <th scope="col" key={t} className="w-1/3">
                      <div className="flex select-none items-center gap-2 px-2">
                        {i == 0 ? (
                          <ChevronUp
                            size={20}
                            onClick={() => toggle(k.id)}
                            className={`cursor-pointer duration-75 ${k.open ? '' : 'rotate-180'}`}
                          />
                        ) : null}
                        <span>{t}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              {k.open ? (
                <tbody>
                  <tr className="border-b ">
                    <th
                      scope="row"
                      className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 "
                    >
                      <div className="flex gap-2">
                        <Checkbox
                          id="class"
                          value="class1"
                          name="class"
                          htmlFor="class1"
                          checked={true}
                        />
                        <Label htmlFor="class1" main={false}>
                          Folder 1
                        </Label>
                      </div>
                    </th>
                    <td className="px-6 py-4">200 images</td>
                    <td className="py-4m px-6 text-green-500">
                      Annotations complete
                    </td>
                  </tr>

                  <tr className="border-b ">
                    <th
                      scope="row"
                      className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 "
                    >
                      <div className="flex gap-2">
                        <Checkbox
                          id="class"
                          value="class1"
                          name="class"
                          htmlFor="class1"
                          checked={false}
                        />
                        <Label htmlFor="class1" main={false}>
                          Folder 1
                        </Label>
                      </div>
                    </th>
                    <td className="px-6 py-4">200 images</td>
                    <td className="px-6 py-4 text-red-500">
                      Annotations incomplete
                    </td>
                  </tr>
                </tbody>
              ) : null}
            </table>
          </div>
        ))}
      </div> */}
      <div>
        {folders.map((k) => (
          <div
            key={k.id}
            className="placeholder:*: relative  py-2 odd:border-t-[1px] sm:rounded-lg"
          >
            <table className="w-full text-left text-sm text-gray-500  ">
              <thead className="bg-white text-sm uppercase text-gray-700 ">
                <tr>
                  <th scope="col" key={1} className="w-1/3">
                    <div className="flex select-none items-center gap-2 px-2">
                      <ChevronUp
                        size={20}
                        onClick={() => toggle(k.id)}
                        className={`cursor-pointer duration-75 ${k.open ? '' : 'rotate-180'}`}
                      />
                      <span>{k.variantName}</span>
                    </div>
                  </th>
                  <th scope="col" key={2} className="w-1/3">
                    <div className="flex select-none items-center gap-2 px-2">
                      <span>{k.cameraConfig}</span>
                    </div>
                  </th>
                  <th scope="col" key={3} className="w-1/3">
                    <div className="flex select-none items-center gap-2 px-2">
                      <span>{k.capturePositionName}</span>
                    </div>
                  </th>
                </tr>
              </thead>
              {k.open ? (
                // <tbody>
                // <tr className="border-b ">
                //   <th
                //     scope="row"
                //     className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 "
                //   >
                //     <div className="flex gap-2">
                //       <Checkbox
                //         id="class"
                //         value="class1"
                //         name="class"
                //         htmlFor="class1"
                //         checked={true}
                //       />
                //       <Label htmlFor="class1" main={false}>
                //         Folder 1
                //       </Label>
                //     </div>
                //   </th>
                //   <td className="px-6 py-4">200 images</td>
                //   <td className="py-4m px-6 text-green-500">
                //     Annotations complete
                //   </td>
                // </tr>

                //   <tr className="border-b ">
                //     <th
                //       scope="row"
                //       className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 "
                //     >
                //       <div className="flex gap-2">
                //         <Checkbox
                //           id="class"
                //           value="class1"
                //           name="class"
                //           htmlFor="class1"
                //           checked={false}
                //         />
                //         <Label htmlFor="class1" main={false}>
                //           Folder 1
                //         </Label>
                //       </div>
                //     </th>
                //     <td className="px-6 py-4">200 images</td>
                //     <td className="px-6 py-4 text-red-500">
                //       Annotations incomplete
                //     </td>
                //   </tr>
                // </tbody>
                <tbody>
                  {k.folders.map((folder, index) => {
                    return (
                      <tr className="border-b ">
                        <th
                          scope="row"
                          className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 "
                        >
                          <div className="flex gap-2">
                            <Checkbox
                              id="class"
                              value="class1"
                              name="class"
                              htmlFor="class1"
                              checked={folder.check}
                              onChange={() => handleCheckboxChange(k.id, index)}
                            />
                            <Label htmlFor="class1" main={false}>
                              {folder.name}
                            </Label>
                          </div>
                        </th>
                        <td className="px-6 py-4">{folder.totalImages}</td>
                        <td className="py-4m px-6 text-green-500">
                          Annotations complete
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
