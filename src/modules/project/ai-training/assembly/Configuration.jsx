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
import toast from 'react-hot-toast';

export default function Configuration({ setLoading, formRef }) {
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
  const [configuration, setConfiguration] = useRecoilState(configurationAtom);
  const [classAt, setClassAtom] = useRecoilState(classAtom);
  const [error, setError] = useState('');

  const fetchAllRois = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/model/required', {
        params: {
          projectId: params.projectId,
        },
      });
      const roiArr = res.data.data.detection.map((obj) => {
        // const roiClasses = 
        return { ...obj, check: false };
      });
      // setRois(roiArr);
      if (configuration.length != 0) {
        setRois(configuration);
      } else {
        setRois(roiArr);
        // setClassAtom(roiArr);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      toast.error(JSON.stringify(e));
    }
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

    // setClasses(classArr);
    if (classAt.length != 0) {
      console.log("classAtom:",classAt)
      setClasses(classAt);
    } else {
      setClasses(classArr);
      setClassAtom([...classArr]);
    }
    // setClassAtom(classArr);
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

  const handleROICheckbox = (roiId) => {
    const selectedRoi = rois.filter((roiObj) => roiObj.roi.id === roiId);
    console.log('selectedRoi:', selectedRoi[0], roiId);
    if (selectedRoi[0].check) {
      selectedRoi[0].classes.map((className) => {
        handleDeSelect(className);
      });
    } else {
      selectedRoi[0].classes.map((className) => {
        handleSelect(className);
      });
    }
  };

  const handleDeSelect = (frontEle) => {
    const [newRois, newClasses] = getRoisAndClasses(
      frontEle,
      rois,
      classes,
      false
    );
    console.log('deselecting:', frontEle, newRois, newClasses);
    setClasses(newClasses);
    setClassAtom(newClasses);
    setRois(newRois);
    setConfiguration([...newRois]);
    validate(newClasses)
  };

  const handleSelect = (frontEle) => {
    const [newRois, newClasses] = getRoisAndClasses(
      frontEle,
      rois,
      classes,
      true
    );
    console.log('selecting:', frontEle, newRois, newClasses);
    setClasses([...newClasses]);
    setClassAtom([...newClasses]);
    setRois([...newRois]);
    setConfiguration([...newRois]);
    validate(newClasses)
  };

  const helper = async () => {
    setLoading(true);
    try {
      await Promise.all[(fetchAllClasses(), fetchAllRois())];
      console.log('here');
      setLoading(false);
    } catch (e) {
      toast.error(e?.response?.data?.data?.message);
      setLoading(false);
    }
  };

  const validate = (formClasses) => {
    let formError = '';
    if(formClasses.every(clx => clx.check === false)){
      formError = 'Please select atleast one class to continue.'
    }
    setError(formError)
    return formError;
  }

  const handleSubmit = () => {
    const formError = validate(classes);
    return formError ? false : true;
  }

  formRef.current = {handleSubmit}

  React.useEffect(() => {
    helper();
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
        <p>Select the classes you wish to train this AI model for:</p>
        <div className="flex gap-4">
          {classes.map((classObj) => {
            return (
              <div
                className="flex gap-2"
                key={classObj.id}
                onClick={() => {
                  console.log('here');
                  handleCheckbox(classObj.id);
                }}
              >
                <Checkbox
                  id={classObj.id}
                  value="class1"
                  name={classObj.name}
                  htmlFor="class1"
                  checked={classObj.check}
                  onChange={() => {}}
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
        <p>Select from the following ROI configurations you wish to build this AI model for:</p>
        <div className="placeholder:*: relative shadow-md sm:rounded-lg">
          <table className="w-full text-left text-sm text-gray-500 rtl:text-right ">
            <thead className="bg-white text-sm uppercase text-gray-700 ">
              <tr>
                {columns.map((t) => (
                  <th
                    scope="col"
                    className="whitespace-nowrap px-6 py-3"
                    key={t}
                  >
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
                      <div className="flex gap-2">
                        <Checkbox
                          id={roi.roi.id}
                          checked={roi.check}
                          onChange={() => {}}
                          onClick={() => {
                            handleROICheckbox(roi.roi.id);
                          }}
                        />
                        <Label htmlFor="class1" main={false}>
                          {roi.variant.name}
                        </Label>
                      </div>
                    </th>
                    <td className="px-6 py-4">{roi.capturePosition.name}</td>
                    <td className="px-6 py-4">{roi.cameraConfig.name}</td>
                    <td className="px-6 py-4">{roi.roi.name}</td>
                    {/* <td className={`px-6 py-4 ${statusObj['success']}`}>-</td> */}
                    <td className="flex flex-wrap gap-2 px-6 py-4">
                      {roi.classes.map((className, index) => {
                        return (
                          <Chip key={className} color={`color-${index + 1}`}>
                            {className}
                          </Chip>
                        );
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
}
