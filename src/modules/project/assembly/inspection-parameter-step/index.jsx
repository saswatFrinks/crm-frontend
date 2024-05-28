import Button from '@/shared/ui/Button';
import Checkbox from '@/shared/ui/Checkbox';
import Hr from '@/shared/ui/Hr';
import Input from '@/shared/ui/Input';
import Label from '@/shared/ui/Label';
import Modal from '@/shared/ui/Modal';
import Pen from '@/shared/icons/Pen';
import Radio from '@/shared/ui/Radio';
import Select from '@/shared/ui/Select';

import React, { useEffect, useState } from 'react';
import { ChevronDown, Plus, Trash } from 'react-feather';

import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { modalAtom } from '@/shared/states/modal.state';
import {
  ASSEMBLY_CONFIG,
  DEFAULT_OBJECT,
  DEFAULT_ROI,
  OPERATIONS,
  RECTANGLE_TYPE,
  STATUS,
} from '@/core/constants';

import {
  assemblyAtom,
  currentRectangleIdAtom,
  currentRoiIdAtom,
  editingAtom,
  rectanglesAtom,
  selectedFileAtom,
} from '../../state';
import ArrowUp from '@/shared/icons/ArrowUp';
import DeleteObjectModal from './DeleteObjectModal';
import DeleteRoiModal from './DeleteRoiModal';
import axiosInstance from '@/core/request/aixosinstance';
import { useParams } from 'react-router-dom';
import {
  classOptionsAtom,
  selectedConfigurationAtom,
} from '../../project-configuration/state';
import { cloneDeep } from 'lodash';

export default function InspectionParameterStep(props) {
  // type: moving | stationary {{ASSEMBLY_CONFIG}}
  const { type = ASSEMBLY_CONFIG.STATIONARY, nextRef } = props;
  // console.log(type)
  const param = useParams();

  const setModalState = useSetRecoilState(modalAtom);

  const setIsEditing = useSetRecoilState(editingAtom);

  const [deleteModal, setDeleteModal] = React.useState('roi');

  const [configuration, setConfiguration] = useRecoilState(assemblyAtom);
  const selectedConfiguration = useRecoilValue(selectedConfigurationAtom);

  // const [classOptions, setClassOptions] = useState([])
  const [classOptions, setClassOptions] = useRecoilState(classOptionsAtom);

  const setCurrentRoiId = useSetRecoilState(currentRoiIdAtom);
  const setSelectedRectId = useSetRecoilState(currentRectangleIdAtom);
  const [rectangles, setRectangles] = useRecoilState(rectanglesAtom);

  const [formData, setFormData] = useState(new Map());
  const [errors, setErrors] = useState(new Map());

  const [movingForm, setMovingForm] = useState({
    productFlow: '',
    primaryObject: '',
    primaryObjectClass: '',
  });
  const [movingErrors, setMovingErrors] = useState({
    productFlowError: '',
    primaryObjectError: '',
    primaryObjectClassError: '',
  });

  const handleSubmit = () => {
    const res1 = validate(formData);
    const res2 = validateMoving(movingForm);
    return res1 || res2;
  };

  // console.log("movingForm:", movingForm)

  nextRef.current = {
    handleSubmit: handleSubmit,
  };

  const validateMoving = (values) => {
    if(type !== ASSEMBLY_CONFIG.MOVING) return false;
    let errorFound = false;
    const flowError = !values.productFlow ? 'Product Flow is required' : '';
    const objectError = !values.primaryObject
      ? 'Primary Object is required'
      : '';
    const classError = !values.primaryObjectClass
      ? 'Primary Object Class is required'
      : '';
    if (flowError || objectError || classError) errorFound = true;
    setMovingErrors({
      productFlowError: flowError,
      primaryObjectError: objectError,
      primaryObjectClassError: classError,
    });
    return errorFound;
  };

  const validate = (values) => {
    let errorFound = false;
    const updatedErrors = new Map(errors);
    console.log('configuration:', configuration);

    configuration.rois.forEach((roi, roiIndex) => {
      roi.parts.forEach((obj, objIndex) => {
        const key = `${roiIndex}-${objIndex}`;
        const nameError = !obj.objectName ? 'Object name is required' : '';
        const classError = !obj.className ? 'Class is required' : '';
        const qtyError = !obj.qty ? 'Object quantity is required' : '';
        if (nameError || classError || qtyError) errorFound = true;

        updatedErrors.set(key, {
          name: nameError,
          class: classError,
          qty: qtyError,
        });
      });
    });

    setErrors(updatedErrors);
    return errorFound;
  };

  const getClasses = async () => {
    try {
      const classes = await axiosInstance.get('/class/list', {
        params: {
          projectId: param.projectId,
        },
      });
      // console.log('configuration:', selectedConfiguration);
      setClassOptions(classes.data.data);
    } catch (error) {}
  };

  useEffect(() => {
    getClasses();
    // console.log('configuration:', selectedConfiguration);
  }, []);

  useEffect(() => {
    if (!classOptions?.length > 0) {
      return;
    }
    let tempRois = cloneDeep(configuration.rois);
    // console.log('confRois:', configuration.rois);
    if (tempRois[0].parts[0].class === '') {
      tempRois[0].parts[0].class = classOptions[0].id;
      tempRois[0].parts[0].className = classOptions[0].name;
    }
    setConfiguration({
      ...configuration,
      rois: tempRois,
      id: selectedConfiguration.id,
    });
  }, [classOptions]);

  const addRoi = () => {
    setConfiguration((t) => ({
      ...t,
      id: selectedConfiguration.id,
      rois: [
        ...t.rois,
        {
          ...DEFAULT_ROI,
          id: t.rois.length,
        },
      ],
    }));
  };
  // console.log({formData})

  const addObject = (roiId) => {
    setConfiguration((config) => ({
      ...config,
      rois: config.rois.map((roi) => ({
        ...roi,
        parts:
          roi.id == roiId
            ? [...roi.parts, { ...DEFAULT_OBJECT, id: Date.now() }]
            : roi.parts,
      })),
    }));
  };

  const openDeleteModal = () => {
    const selectedIds = [];

    configuration.rois.forEach((roi) => {
      roi.parts.forEach((obj) => {
        if (obj.checked) {
          selectedIds.push(obj.id);
        }
      });
    });

    if (selectedIds.length) {
      setDeleteModal('object');
      setModalState(true);
    }
  };

  const openDeleteRoiModal = () => {
    if (configuration.rois.some((t) => t.checked)) {
      setDeleteModal('roi');
      setModalState(true);
    }
  };

  const deleteObject = () => {
    setConfiguration((t) => ({
      ...t,
      rois: t.rois.map((k) => ({
        ...k,
        parts: k.parts.filter((h) => !h.checked),
      })),
    }));
  };

  const deleteRoi = () => {
    let roiId = null;
    setConfiguration((t) => {
      // console.log('deleting roi:', t);
      const ret = t.rois.filter((k) => !k.checked);
      roiId = t.rois.find((ele) => ele.checked)?.id;
      return {
        ...t,
        rois: ret,
      };
    });
    if (roiId) {
      setRectangles((rects) => rects.filter((rect) => rect.roiId !== roiId));
    }
  };

  const genObjId = (id) => {
    return `obj-${id}`;
  };

  // console.log('rects:', rectangles);

  const handleClickLabel = (id) => {
    setIsEditing(true);
    setCurrentRoiId(id);
    let idx = rectangles.findIndex(
      (rect) => rect.roiId == id && rect.rectType == RECTANGLE_TYPE.ROI
    );
    if (idx >= 0) {
      setSelectedRectId(rectangles[idx].uuid);
    }
    setConfiguration((t) => ({
      ...t,
      rois: t.rois.map((k) => ({
        ...k,
        status: k.id == id ? STATUS.EDITING : k.status,
      })),
    }));
  };

  const genLabelClass = (status) => {
    const obj = {
      [STATUS.DEFAULT]: 'primary',
      [STATUS.EDITING]: 'warn',
      [STATUS.FINISH]: 'success',
    };
    return obj[status];
  };

  const toggleRoi = (id) => {
    setConfiguration((t) => ({
      ...t,
      rois: t.rois.map((k) => ({
        ...k,
        open: k.id == id ? !k.open : k.open,
      })),
    }));
  };

  const toggleObjective = (id) => {
    setConfiguration((t) => ({
      ...t,
      rois: t.rois.map((k) => ({
        ...k,
        parts: k.parts.map((h) => ({
          ...h,
          open: h.id == id ? !h.open : h.open,
        })),
      })),
    }));
  };

  const checkIsObjectChecked = () => {
    let flag = false;
    configuration.rois.forEach((roi) => {
      roi.parts.forEach((obj) => {
        if (obj.checked) {
          flag = true;
        }
      });
    });
    return flag;
  };

  const renderAssemblyHeading = () => {
    if (type == ASSEMBLY_CONFIG.MOVING) {
      return (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Label main={false}>Product Flow:</Label>
            <div className="flex items-center gap-2">
              <Radio
                name="productFlow"
                value={4}
                checked={configuration.productFlow == 4}
                onChange={(e) => {
                  setConfiguration((t) => ({
                    ...t,
                    productFlow: e.target.value,
                  }));
                  setMovingForm((form) => ({
                    ...form,
                    productFlow: e.target.value,
                  }));
                }}
              />
              <ArrowUp />
            </div>
            <div className="flex items-center gap-2">
              <Radio
                name="productFlow"
                value={3}
                checked={configuration.productFlow == 3}
                onChange={(e) => {
                  setConfiguration((t) => ({
                    ...t,
                    productFlow: e.target.value,
                  }));
                  setMovingForm((form) => ({
                    ...form,
                    productFlow: e.target.value,
                  }));
                }}
              />
              <ArrowUp className="rotate-180" />
            </div>
            <div className="flex items-center gap-2">
              <Radio
                name="productFlow"
                value={1}
                checked={configuration.productFlow == 1}
                onChange={(e) => {
                  setConfiguration((t) => ({
                    ...t,
                    productFlow: e.target.value,
                  }));
                  setMovingForm((form) => ({
                    ...form,
                    productFlow: e.target.value,
                  }));
                }}
              />
              <ArrowUp className="-rotate-90" />
            </div>
            <div className="flex items-center gap-2">
              <Radio
                name="productFlow"
                value={2}
                checked={configuration.productFlow == 2}
                onChange={(e) => {
                  setConfiguration((t) => ({
                    ...t,
                    productFlow: e.target.value,
                  }));
                  setMovingForm((form) => ({
                    ...form,
                    productFlow: e.target.value,
                  }));
                }}
              />
              <ArrowUp className="rotate-90" />
            </div>
          </div>
          <span className="text-sm text-red-500">
            {movingErrors?.productFlowError}
          </span>
          <div className="flex items-center gap-2">
            <Label main={false}>Primary Object:</Label>
            <div className="ml-16 w-44">
              <Input
                placeholder="Enter primary object"
                size="xs"
                value={configuration.primaryObject}
                onChange={(e) => {
                  setConfiguration((t) => ({
                    ...t,
                    primaryObject: e.target.value,
                  }));
                  setMovingForm((form) => ({
                    ...form,
                    primaryObject: e.target.value,
                  }));
                }}
                errorMessage={movingErrors?.primaryObjectError}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Label main={false}>Primary Object Class:</Label>
            <div className="ml-8 w-44 max-w-xs">
              <Select
                size="xs"
                placeholder="Select class"
                options={classOptions}
                value={configuration.primaryObjectClass}
                onChange={(e) => {
                  setConfiguration((d) => ({
                    ...d,
                    primaryObjectClass: e.target.value,
                  }));
                  setMovingForm((form) => ({
                    ...form,
                    primaryObjectClass: e.target.value,
                  }));
                }}
                errorMessage={movingErrors?.primaryObjectClassError}
              />
            </div>
          </div>

          <Hr />
        </div>
      );
    }
    return (
      <div className="mb-4">
        <div className="mb-4 flex justify-end gap-4">
          {configuration.rois.some((t) => t.checked) && (
            <Button
              size="tiny"
              variant="border"
              color="danger"
              fullWidth={false}
              onClick={openDeleteRoiModal}
            >
              <div className="flex items-center justify-center gap-2">
                <Trash size={18} /> Delete ROI
              </div>
            </Button>
          )}
          <Button
            size="tiny"
            variant="border"
            onClick={addRoi}
            fullWidth={false}
          >
            <div className="flex items-center justify-center gap-2">
              <Plus size={18} /> Add Roi
            </div>
          </Button>
        </div>
        <Hr />
      </div>
    );
  };

  const renderModal = () => {
    if (deleteModal == 'roi') {
      return <DeleteRoiModal handleSubmit={deleteRoi} />;
    }
    return <DeleteObjectModal handleSubmit={deleteObject} />;
  };

  const handleObjectChange = (roiIndex, objIndex, key, value) => {
    // const newConfig = { ...configuration };
    // newConfig.rois[roiIndex].parts[objIndex][key] = value;
    // setConfiguration(newConfig);

    const newFormData = new Map(formData);
    const fieldKey = `${roiIndex}-${objIndex}`;
    const fieldData = newFormData.get(fieldKey) || {};
    fieldData[key] = value;
    newFormData.set(fieldKey, fieldData);
    setFormData(newFormData);

    const newErrors = new Map(errors);
    const errorData = newErrors.get(fieldKey) || {};
    console.log('value', value);
    if (key === 'objectName' && value) {
      errorData.name = '';
    } else if (key === 'objectQty' && value) {
      errorData.qty = '';
    } else if (key === 'class' && value) {
      errorData.class = '';
    }
    newErrors.set(fieldKey, errorData);
    setErrors(newErrors);
  };

  return (
    <>
      <Modal>{renderModal()}</Modal>

      {renderAssemblyHeading()}

      <div className="mt-2 flex flex-col gap-4">
        {/* roi list */}
        {configuration.rois.map((t, i) => (
          <div key={i}>
            <div className="mb-4 flex items-center gap-4">
              {type !== ASSEMBLY_CONFIG.MOVING && <Checkbox
                id={t.id}
                value={t.id}
                checked={t.checked}
                onClick={() =>
                  setConfiguration((configuration) => ({
                    ...configuration,
                    rois: configuration.rois.map((k) => ({
                      ...k,
                      checked: t.id == k.id ? !k.checked : k.checked,
                    })),
                  }))
                }
                htmlFor={t.id}
              />}
              <span>Roi {t.id}</span>
              <div className="flex-1">
                <Button
                  size="tiny"
                  color={genLabelClass(t.status)}
                  fullWidth={false}
                  onClick={() => handleClickLabel(t.id)}
                >
                  <div className="flex items-center gap-2">
                    <Pen /> {t.status == STATUS.EDITING ? 'Edit' : 'Label'} ROI
                  </div>
                </Button>
              </div>
              <div className="flex w-[320px] items-center gap-4">
                {checkIsObjectChecked() && (
                  <Button
                    size="tiny"
                    variant="border"
                    color="danger"
                    onClick={openDeleteModal}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Trash size={18} /> Delete object
                    </div>
                  </Button>
                )}
                <Button
                  size="tiny"
                  variant="border"
                  onClick={() => addObject(t.id)}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Plus size={18} /> Add Object
                  </div>
                </Button>
              </div>
              <ChevronDown
                size={24}
                className={`cursor-pointer duration-100 ${t.open ? 'rotate-180' : ''}`}
                onClick={() => toggleRoi(t.id)}
              />
            </div>
            {/* object list */}

            {t.parts.map((obj, objIndex) =>
              t.open ? (
                <div key={obj.id} className="ml-8 flex flex-col gap-4">
                  <Hr />
                  <div className=" flex items-center justify-between">
                    <div className="flex gap-4">
                      <Checkbox
                        id={genObjId(obj.id)}
                        value={obj.id}
                        checked={obj.checked}
                        onClick={() =>
                          setConfiguration((configuration) => ({
                            ...configuration,
                            rois: configuration.rois.map((k) => ({
                              ...k,
                              parts: k.parts.map((h) => ({
                                ...h,
                                checked:
                                  h.id == obj.id ? !h.checked : h.checked,
                              })),
                            })),
                          }))
                        }
                        htmlFor={genObjId(obj.id)}
                      />
                      <span className="select-none">Object {objIndex + 1}</span>
                    </div>
                    <ChevronDown
                      size={24}
                      className={`cursor-pointer duration-100 ${obj.open ? 'rotate-180' : ''}`}
                      onClick={() => toggleObjective(obj.id)}
                    />
                  </div>

                  {obj.open ? (
                    <div className="ml-4 flex flex-col gap-4">
                      <div className="flex items-center gap-2">
                        <Label main={false}>Object Name:</Label>
                        <div className="ml-8 w-44">
                          <Input
                            placeholder="Enter object name"
                            size="xs"
                            value={
                              configuration.rois[i].parts[objIndex].objectName
                            }
                            onChange={(e) => {
                              setConfiguration((d) => ({
                                ...d,
                                rois: d.rois.map((roi, locRIdx) => {
                                  if (locRIdx != i) return roi;
                                  return {
                                    ...roi,
                                    parts: roi.parts.map((obj, locOIdx) => {
                                      if (locOIdx != objIndex) return obj;
                                      return {
                                        ...obj,
                                        objectName: e.target.value,
                                      };
                                    }),
                                  };
                                }),
                              }));
                              handleObjectChange(
                                t.id,
                                objIndex,
                                'objectName',
                                e.target.value
                              );
                              // setFormData({
                              //   ...formData,
                              //   objectName: e.target.value,
                              // });
                            }}
                            errorMessage={
                              errors.get(`${t.id}-${objIndex}`)?.name
                            }
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Label main={false}>Select Class:</Label>
                        <div className="ml-11 w-44">
                          <Select
                            size="xs"
                            placeholder="Select class"
                            value={configuration.rois[i].parts[objIndex].class}
                            onChange={(e) => {
                              let temp = '';
                              classOptions.forEach((opt) => {
                                if (opt.id === e.target.value) {
                                  temp = opt.name;
                                }
                              });
                              setConfiguration((d) => ({
                                ...d,
                                rois: d.rois.map((roi, locRIdx) => {
                                  if (locRIdx != i) return roi;
                                  return {
                                    ...roi,
                                    parts: roi.parts.map((obj, locOIdx) => {
                                      if (locOIdx != objIndex) return obj;
                                      return {
                                        ...obj,
                                        class: e.target.value,
                                        className: temp,
                                      };
                                    }),
                                  };
                                }),
                              }));
                              handleObjectChange(
                                t.id,
                                objIndex,
                                'objectName',
                                e.target.value
                              );
                            }}
                            options={classOptions}
                            errorMessage={
                              errors.get(`${t.id}-${objIndex}`)?.class
                            }
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Label main={false}>Select Operation:</Label>
                        <div className="ml-2 w-44">
                          <Select
                            size="xs"
                            value={
                              configuration.rois[i].parts[objIndex].operation
                            }
                            onChange={(e) => {
                              setConfiguration((d) => ({
                                ...d,
                                rois: d.rois.map((roi, locRIdx) => {
                                  if (locRIdx != i) return roi;
                                  return {
                                    ...roi,
                                    parts: roi.parts.map((obj, locOIdx) => {
                                      if (locOIdx != objIndex) return obj;
                                      return {
                                        ...obj,
                                        operation: e.target.value,
                                      };
                                    }),
                                  };
                                }),
                              }));
                            }}
                            placeholder="Select operation"
                            options={OPERATIONS}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Label main={false}>Object Qty:</Label>
                        <div className="ml-12 w-44">
                          <Input
                            placeholder="Enter object qty"
                            type="number"
                            min="1"
                            size="xs"
                            value={configuration.rois[i].parts[objIndex].qty}
                            onChange={(e) => {
                              setConfiguration((d) => ({
                                ...d,
                                rois: d.rois.map((roi, locRIdx) => {
                                  if (locRIdx != i) return roi;
                                  return {
                                    ...roi,
                                    parts: roi.parts.map((obj, locOIdx) => {
                                      if (locOIdx != objIndex) return obj;
                                      return {
                                        ...obj,
                                        qty: e.target.value,
                                      };
                                    }),
                                  };
                                }),
                              }));
                              handleObjectChange(
                                t.id,
                                objIndex,
                                'objectQty',
                                e.target.value
                              );
                              // setFormData({
                              //   ...formData,
                              //   objectQty: e.target.value,
                              // });
                            }}
                            errorMessage={
                              errors.get(`${t.id}-${objIndex}`)?.qty
                            }
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="mb-5 inline-flex cursor-pointer items-center">
                          <input
                            type="checkbox"
                            className="peer sr-only"
                            onClick={(e) => {
                              setConfiguration((d) => ({
                                ...d,
                                rois: d.rois.map((roi, locRIdx) => {
                                  if (locRIdx != i) return roi;
                                  return {
                                    ...roi,
                                    parts: roi.parts.map((obj, locOIdx) => {
                                      if (locOIdx != objIndex) return obj;
                                      return {
                                        ...obj,
                                        classify: e.target.value,
                                      };
                                    }),
                                  };
                                }),
                              }));
                            }}
                          />
                          <div className="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
                          <span className="ms-3 text-sm font-medium text-gray-900 ">
                            Classify
                          </span>
                        </label>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null
            )}
          </div>
        ))}
      </div>
    </>
  );
}
