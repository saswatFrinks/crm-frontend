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
  STATUS,
} from '@/core/constants';

import { assemblyAtom, currentRoiIdAtom, editingAtom } from '../../state';
import ArrowUp from '@/shared/icons/ArrowUp';
import DeleteObjectModal from './DeleteObjectModal';
import DeleteRoiModal from './DeleteRoiModal';
import axiosInstance from '@/core/request/aixosinstance';
import { useParams } from 'react-router-dom';
import { selectedConfigurationAtom } from '../../project-configuration/state';
import { cloneDeep } from 'lodash';

export default function InspectionParameterStep(props) {
  // type: moving | stationary {{ASSEMBLY_CONFIG}}
  const { type = ASSEMBLY_CONFIG.STATIONARY } = props;
  console.log(type)
  const param = useParams();
  
  const setModalState = useSetRecoilState(modalAtom);
  
  const setIsEditing = useSetRecoilState(editingAtom);
  
  const [deleteModal, setDeleteModal] = React.useState('roi');
  
  const [configuration, setConfiguration] = useRecoilState(assemblyAtom);
  const selectedConfiguration = useRecoilValue(selectedConfigurationAtom)

  const [classOptions, setClassOptions] = useState([])

  const setCurrentRoiId = useSetRecoilState(currentRoiIdAtom);

  const getClasses = async() => {
    try {
      const classes = await axiosInstance.get("/class/list", {
        params: {
          projectId: param.projectId,
        }
      })
      setClassOptions(classes.data.data)
    } catch (error) {
      
    }
  }

  useEffect(()=>{
    getClasses()
    console.log(selectedConfiguration)
  },[])

  useEffect(()=>{
    if(!classOptions?.length>0){
      return
    }
    let tempRois = cloneDeep(configuration.rois)
    if(tempRois[0].parts[0].class === ''){
      tempRois[0].parts[0].class = classOptions[0].id
      tempRois[0].parts[0].className = classOptions[0].name
    }
    setConfiguration({
      ...configuration, rois: tempRois, id: selectedConfiguration.id
    })
  }, [classOptions])

  const addRoi = () => {
    setConfiguration((t) => ({
      ...t,
      id: selectedConfiguration.id,
      rois: [
        ...t.rois,
        {
          ...DEFAULT_ROI,
          id: Date.now(),
        },
      ],
    }));
  };

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
    setConfiguration((t) => ({
      ...t,
      rois: t.rois.filter((k) => !k.checked),
    }));
  };

  const genObjId = (id) => {
    return `obj-${id}`;
  };

  const handleClickLabel = (id) => {
    setIsEditing(true);
    setCurrentRoiId(id);
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
                onChange={(e) =>
                  setConfiguration((t) => ({
                    ...t,
                    productFlow: e.target.value,
                  }))
                }
              />
              <ArrowUp />
            </div>
            <div className="flex items-center gap-2">
              <Radio
                name="productFlow"
                value={3}
                checked={configuration.productFlow == 3}
                onChange={(e) =>
                  setConfiguration((t) => ({
                    ...t,
                    productFlow: e.target.value,
                  }))
                }
              />
              <ArrowUp className="rotate-180" />
            </div>
            <div className="flex items-center gap-2">
              <Radio
                name="productFlow"
                value={1}
                checked={configuration.productFlow == 1}
                onChange={(e) =>
                  setConfiguration((t) => ({
                    ...t,
                    productFlow: e.target.value,
                  }))
                }
              />
              <ArrowUp className="-rotate-90" />
            </div>
            <div className="flex items-center gap-2">
              <Radio
                name="productFlow"
                value={2}
                checked={configuration.productFlow == 2}
                onChange={(e) =>
                  setConfiguration((t) => ({
                    ...t,
                    productFlow: e.target.value,
                  }))
                }
              />
              <ArrowUp className="rotate-90" />
            </div>
          </div>

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
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Label main={false}>Primary Object Class:</Label>
            <div className="ml-8 w-44 max-w-xs">
              <Select size="xs" placeholder="Select class" 
              options={classOptions}
              value={configuration.primaryObjectClass}
              onChange={(e)=>{
                setConfiguration((d) => ({
                  ...d,
                  primaryObjectClass: e.target.value
                }));
              }}
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

  return (
    <>
      <Modal>{renderModal()}</Modal>

      {renderAssemblyHeading()}

      <div className="mt-2 flex flex-col gap-4">
        {/* roi list */}
        {configuration.rois.map((t, i) => (
          <div key={i}>
            <div className="mb-4 flex items-center gap-4">
              <Checkbox
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
              />
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
                            value={configuration.rois[i].parts[objIndex].objectName}
                            onChange={(e) => {
                              setConfiguration((d) => ({
                                ...d,
                                rois: d.rois.map((roi, locRIdx) => {
                                  if(locRIdx!=i) return roi
                                  return{
                                  ...roi,
                                  parts: roi.parts.map((obj, locOIdx) => {
                                    if(locOIdx!=objIndex) return obj
                                    return{
                                    ...obj,
                                    objectName: e.target.value,
                                  }}),
                                }}),
                              }));
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Label main={false}>Select Class:</Label>
                        <div className="ml-11 w-44">
                          <Select size="xs" placeholder="Select class" 
                          value={configuration.rois[i].parts[objIndex].class}
                          onChange={(e)=>{
                            let temp = ''
                            classOptions.forEach((opt)=>{
                              if(opt.id===e.target.value){
                                temp = opt.name
                              }
                            })
                            setConfiguration((d) => ({
                              ...d,
                              rois: d.rois.map((roi, locRIdx) => {
                                if(locRIdx!=i) return roi
                                return{
                                ...roi,
                                parts: roi.parts.map((obj, locOIdx) => {
                                  if(locOIdx!=objIndex) return obj
                                  return{
                                  ...obj,
                                  class: e.target.value,
                                  className: temp
                                }}),
                              }}),
                            }));
                          }}
                          options={classOptions}/>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Label main={false}>Select Operation:</Label>
                        <div className="ml-2 w-44">
                          <Select
                            size="xs"
                            value={configuration.rois[i].parts[objIndex].operation}
                            onChange={(e)=>{
                              setConfiguration((d) => ({
                                ...d,
                                rois: d.rois.map((roi, locRIdx) => {
                                  if(locRIdx!=i) return roi
                                  return{
                                  ...roi,
                                  parts: roi.parts.map((obj, locOIdx) => {
                                    if(locOIdx!=objIndex) return obj
                                    return{
                                    ...obj,
                                    operation: e.target.value,
                                  }}),
                                }}),
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
                            size="xs"
                            value={configuration.rois[i].parts[objIndex].qty}
                            onChange={(e) => {
                              setConfiguration((d) => ({
                                ...d,
                                rois: d.rois.map((roi, locRIdx) => {
                                  if(locRIdx!=i) return roi
                                  return{
                                  ...roi,
                                  parts: roi.parts.map((obj, locOIdx) => {
                                    if(locOIdx!=objIndex) return obj
                                    return{
                                    ...obj,
                                    qty: e.target.value,
                                  }}),
                                }}),
                              }));
                            }}
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
                                  if(locRIdx!=i) return roi
                                  return{
                                  ...roi,
                                  parts: roi.parts.map((obj, locOIdx) => {
                                    if(locOIdx!=objIndex) return obj
                                    return{
                                    ...obj,
                                    classify: e.target.value,
                                  }}),
                                }}),
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
