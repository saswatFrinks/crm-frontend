import axiosInstance from '@/core/request/aixosinstance';
import Checkbox from '@/shared/ui/Checkbox';
import Chip from '@/shared/ui/Chip';
import Label from '@/shared/ui/Label';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import React from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { classAtom, configurationAtom } from './state';
import { getRoisAndClasses } from '@/algo/algo';

export default function Configuration() {
  const columns = [
    'Variant',
    'Camera Position',
    'Camera Config',
    'ROI',
    'Classes',
  ];

  const params = useParams();
  const [classes, setClasses] = useState([]);
  const [rois, setRois] = useState([]);
  const setConfiguration = useSetRecoilState(configurationAtom);
  const setClassAtom = useSetRecoilState(classAtom)

  const fetchAllRois = async () => {
    const res = await axiosInstance.get('/model/required', {
      params: {
        projectId: params.projectId,
      },
    });
    setRois(res.data.data.detection);
  };

  const fetchAllClasses = async () => {
    const res = await axiosInstance.get('/assembly/list', {
      params: {
        projectId: params.projectId,
      },
    });

    const classArr = res.data.data.map((obj) => {
      return { ...obj, check: false };
    });

    setClasses(classArr);
    setClassAtom(classArr);
  };

  const handleCheckbox = (id) => {
    const selectedEle = classes.filter((classObj) => classObj.id === id);
    console.log(selectedEle);
    if (selectedEle[0].check) {
      handleDeSelect(selectedEle[0].name);
    } else {
      handleSelect(selectedEle[0].name);
    }
  };

  const handleDeSelect = (frontEle) => {
    const [newRois, newClasses] = getRoisAndClasses(
      frontEle,
      rois,
      classes,
      false
    );
    setClasses(newClasses);
    setClassAtom(newClasses);
    setRois(newRois);
    setConfiguration(newRois);
  };

  const handleSelect = (frontEle) => {
    const [newRois, newClasses] = getRoisAndClasses(
      frontEle,
      rois,
      classes,
      true
    );
    setClasses(newClasses);
    setClassAtom(newClasses);
    setRois(newRois);
    setConfiguration(newRois);
  };

  React.useEffect(() => {
    fetchAllClasses();
    fetchAllRois();
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <h3 className=" text-2xl font-semibold">Configurations & Classes</h3>
      <p>
        Select the configuration and classes you wish to train this AI model
        for. You can only train a single AI model for a particular class and
        only single AI model can run within a ROI. System will automatically
        select classes within same ROI, and ROI configurations containing same
        classes.
      </p>

      <div className="flex flex-col gap-4">
        <p>Select classes to be trained in this AI model:</p>
        <div className="flex gap-4">
          {classes.map((classObj) => {
            return (
              <div className="flex gap-2"key={classObj.id} >
                <Checkbox
                  id={classObj.id}
                  value="class1"
                  name={classObj.name}
                  htmlFor="class1"
                  checked={classObj.check}
                  onChange={() => handleCheckbox(classObj.id)}
                />
                <Label htmlFor="class1" main={false}>
                  {classObj.name}
                </Label>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <p>Select classes to be trained in this AI model:</p>
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
              {rois.map((roi, index) => {
                return (
                  <tr
                    className="border-b odd:bg-white even:bg-[#C6C4FF]/10"
                    key={roi.id}
                  >
                    <th
                      scope="row"
                      className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 "
                    >
                      {/* <Checkbox
                        id={roi.id}
                        value="class1"
                        name="ssss"
                        htmlFor="class1"
                        checked={true}
                        onChange={() => handleCheckbox(classObj.id)}
                      />
                      {roi.variantName} */}
                      <div className="flex gap-2">
                        <Checkbox
                          id={roi.id}
                          value="class1"
                          name="asda"
                          htmlFor="class1"
                          checked={roi.check}
                          // onChange={() => handleCheckbox(classObj.id)}
                        />
                        <Label htmlFor="class1" main={false}>
                          {'asda'}
                        </Label>
                      </div>
                    </th>
                    <td className="px-6 py-4">{roi.capturePositionName}</td>
                    <td className="px-6 py-4">{roi.cameraConfig}</td>
                    <td className="px-6 py-4">{roi.roi}</td>
                    {/* <td className={`px-6 py-4 ${statusObj['success']}`}>-</td> */}
                    <td className="flex flex-wrap gap-2 px-6 py-4">
                      {roi.classNames.map((className, index) => {
                        return (
                          <Chip key={className} color={`color-${index + 1}`}>{className}</Chip>
                        );
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
