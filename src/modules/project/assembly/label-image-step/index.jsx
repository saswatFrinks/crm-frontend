import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit,
  Plus,
  Trash,
} from 'react-feather';
import Select from '@/shared/ui/Select';
import {
  actionStatusAtom,
  annotationMapAtom,
  assemblyAtom,
  cachedFileListAtom,
  currentLabelIdAtom,
  currentRectangleIdAtom,
  editingAtom,
  labelClassAtom,
  labelEditedAtom,
  lastActionNameAtom,
  rectanglesAtom,
  rectanglesTypeAtom,
  selectedFileAtom,
  selectedRoiSelector,
  uploadedFileListAtom,
  // rectangleColorAtom
} from '../../state';
import { ACTION_NAMES, ASSEMBLY_CONFIG, BASE_RECT, RECTANGLE_TYPE, STATUS } from '@/core/constants';
import Button from '@/shared/ui/Button';
import axiosInstance from '@/core/request/aixosinstance';
import { useParams } from 'react-router-dom';
import { getRandomHexColor } from '@/util/util';
import {
  initialLabelsAtom,
  loadedLabelsAtom,
  prevStatusAtom,
  rectangleColorAtom,
  stepAtom,
} from '../state';
import Pagination from '@/shared/ui/Pagination';
import { v4 } from 'uuid';
import ResultPagination from '@/shared/ui/ResultPagination';
import toast from 'react-hot-toast';
import Label from '@/shared/ui/Label';
import Pen from '@/shared/icons/Pen';
import Box from '@/shared/icons/Box';
import Hr from '@/shared/ui/Hr';
import Checkbox from '@/shared/ui/Checkbox';

export default function LabelImage({ type, save }) {
  const configuration = useRecoilValue(assemblyAtom);
  const colors = [
    '#C6C4FF',
    '#7DDE86',
    '#FF9898',
    '#9BDCFD',
    '#FFD188',
    '#E3E5E5',
  ];

  const [rectangleColor, setRectangleColor] =
    useRecoilState(rectangleColorAtom);

  const [labelClasses, setLabelClasses] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedLabelIdx, setSelectedLabelIdx] = useState([]);
  const [annotationMap, setAnnotationMap] = useRecoilState(annotationMapAtom);
  const [selectedLabel, setLabel] = useRecoilState(labelClassAtom);
  const setRectangleType = useSetRecoilState(rectanglesTypeAtom);
  const [prevStatus, setPrevStatus] = useRecoilState(prevStatusAtom);

  const selectedImage = useRecoilValue(selectedFileAtom);

  // const setIsEditing = useSetRecoilState(editingAtom);
  const [isEditing, setIsEditing] = useRecoilState(editingAtom);

  const images = useRecoilValue(cachedFileListAtom);

  const [selectedFile, setSelectedFile] = useRecoilState(selectedFileAtom);
  const [rectangles, setRectangle] = useRecoilState(rectanglesAtom);
  const [initialLabels, setInitialLabels] = useRecoilState(initialLabelsAtom);

  const [labelId, setLabelId] = useRecoilState(currentLabelIdAtom);

  let selectedRois = rectangles.filter(
    (rect) =>
      rect.rectType == RECTANGLE_TYPE.ANNOTATION_LABEL &&
      rect.imageId == selectedFile?.id
  );

  let selectedPrimaryRois = rectangles.filter(
    (rect) =>
      rect.rectType == RECTANGLE_TYPE.ANNOTATION_LABEL &&
      rect.imageId == selectedFile?.id &&
      rect.title == configuration.primaryObject
  );

  const selectedRoisRef = React.useRef(selectedRois);

  const [selectedPolyId, setSelectedPloyId] = useRecoilState(
    currentRectangleIdAtom
  );
  const [loadedLabelData, setLoadedLabelData] =
    useRecoilState(loadedLabelsAtom);
  const params = useParams();
  const labelsRef = React.useRef(labelClasses);
  const [labelEdited, setLabelsEdited] = useRecoilState(labelEditedAtom);
  const actionName = useRecoilValue(lastActionNameAtom);
  const step = useRecoilValue(stepAtom);

  const selectedLabelRef = React.useRef(selectedLabel);

  const removeRectangle = (uuid, imageId) => {
    // if(isEditing) {
    //   toast.error("Please confirm the current label");
    //   return;
    // }
    setRectangle((t) => t.filter((k) => k.uuid !== uuid));
    // setRectangleColor((t) => t.filter((k) => k.name !== name))
    const temp = { ...annotationMap };
    delete temp[uuid];
    setAnnotationMap(temp);
    setLabelsEdited((prev) => ({ ...prev, [imageId]: true }));
  };

  useEffect(() => {
    addClasses();
    setIsEditing(false);
    setLabelId(null);
  }, []);

  console.log({ initialLabels }, { selectedRois });

  const getUniqueHexColor = (colors) => {
    let hexColor;
    do {
      hexColor = getRandomHexColor();
    } while (colors.map((col) => col.color).includes(hexColor));
    return hexColor;
  };

  const genLabelClass = (status) => {
    const obj = {
      [STATUS.DEFAULT]: 'primary',
      [STATUS.EDITING]: 'warn',
      [STATUS.FINISH]: 'success',
    };
    return obj[status];
  };

  const addPrimaryClass = (colors) => {
    if(type === ASSEMBLY_CONFIG.MOVING){
      const newColors = [...colors];
      if(labelClasses.filter(cl => cl.id === configuration.primaryObjectClass).length !== 0 && labelClasses.filter(cl => cl.id === configuration.primaryObjectClass).length !== selectedPrimaryRois.length){
        toast(
          'Please label the added primary classes first',
          {
            icon: '⚠️',
          }
        );
        return;
      }
      const primaryClassId = configuration.primaryObjectClass;
      const primayClassName = configuration.primaryObject;
      const color = getUniqueHexColor(colors);
      const newClass = {
        id: primaryClassId,
        name: primayClassName,
        count: 0,
        color: color,
        status: STATUS.DEFAULT
      }
      newColors.push(newClass);
      setLabelClasses(prev => {
        const prevClasses = [...prev];
        
        console.log('extensible', Array.isArray(colors), Object.isExtensible(newClass))
        console.log({colors, newClass})
        return [
          ...prevClasses,
          newClass
        ];
      })
      return newColors;
    }
    return null;
  }

  const addClasses = () => {
    const temp = {};
    const idMap = {};
    configuration.rois.forEach((roi) => {
      roi.parts.forEach((obj) => {
        temp[obj.className] = temp[obj.className] ? temp[obj.className] + 1 : 0;
        idMap[obj.className] = obj.class;
      });
    });
    const colors = [];
    setLabelClasses(
      Object.keys(temp)
        .map((key, index) => {
          const findColor = rectangleColor.all.find(
            (obj) => obj.name === key
          )?.color;
          const color = findColor ? findColor : getUniqueHexColor(colors);
          colors.push({
            id: idMap[key],
            name: key,
            count: temp[key],
            color: color,
          });
          return {
            id: idMap[key],
            name: key,
            count: temp[key],
            color: color,
          };
        })
        .sort((a, b) => {
          return a.name > b.name ? 1 : -1;
        })
    );

    const newColors = addPrimaryClass(colors);

    setRectangleColor((prev) => ({
      ...prev,
      all: prev.all.length === colors.length ? [...prev.all] : (newColors ? newColors : colors),
    }));
  };

  const handleClassClick = async (e, i, col) => {
    console.log({isEditing}, 'editing');
    if (isEditing) {
      toast(
        'Please confirm the creation of the new label first before proceeding',
        {
          icon: '⚠️',
        }
      );
      return;
    }

    if(labelClasses[i]?.status){
      setPrevStatus(labelClasses[i]?.status);
    }
    console.log({label: labelClasses[i]})
    setIsEditing(true);
    setRectangleType(RECTANGLE_TYPE.ANNOTATION_LABEL);
    setRectangleColor({
      ...rectangleColor,
      selectedColor: col,
    });
    // console.log("name",labelClasses[i].name)
    const update = {
      name: labelClasses[i].name,
      count: labelClasses[i].count,
      id: labelClasses[i].id,
      color: col,
      status: STATUS.EDITING
    };
    setLabel(update);
    selectedLabelRef.current = {
      name: labelClasses[i].name,
      count: labelClasses[i].count,
      id: labelClasses[i].id,
      color: col,
      status: STATUS.EDITING
    };
  };

  const curIndex = images.findIndex((image) => image.id == selectedFile?.id);

  const changeImageFile = (next = true) => {
    if (next && curIndex + 1 < images.length) {
      setSelectedFile(images[curIndex + 1]);
    }
    if (!next && curIndex > 0) {
      setSelectedFile(images[curIndex - 1]);
    }
  };

  const setPageNum = (p) => {
    if (isEditing) {
      toast(
        'Please confirm the creation of the new label first before proceeding',
        {
          icon: '⚠️',
        }
      );
      return;
    }
    setSelectedFile(images[p - 1]);
    setPage(p);
  };

  React.useEffect(() => {
    if (actionName == ACTION_NAMES.SELECTED && step == 2) {
      setLabelsEdited((prev) => ({ ...prev, [selectedImage.id]: true }));
    }
  }, [actionName]);

  React.useEffect(() => {
    let annotations = [];
    annotations = selectedRois.filter(
      (e) =>
        e.rectType == RECTANGLE_TYPE.ANNOTATION_LABEL &&
        annotationMap[e.uuid] == undefined
    );
    if (annotations.length) {
      setAnnotationMap((prev) => {
        const updates = {};
        annotations.forEach((annot) => {
          updates[annot.uuid] = selectedLabel.id;
          updates[annot.stroke] = selectedLabel.color;
        });
        return { ...prev, ...updates };
      });
    }
    if (annotations.length) {
      console.log('poly', annotations[0].uuid);
      setSelectedPloyId(annotations[0].uuid);
      setLabelId(annotations[0].uuid);
    }
  }, [selectedRois, annotationMap]);

  // useEffect(() => {
  //   setRectangleColor({...rectangleColor})
  // }, [rectangleColor])

  React.useEffect(() => {
    const ind = images.findIndex((im) => im.id === selectedFile.id);
    if (ind >= 0 && !loadedLabelData[ind] && rectangleColor.all.length) {
      setLoadedLabelData((prev) => {
        return Array.from({ length: images.length }, () => true);
      });
      const getData = async () => {
        try {
          const data = await axiosInstance.get('/configuration/label-files', {
            params: {
              configurationId: params.configurationId,
            },
          });
          const loadedData = data?.data.data;
          if (loadedData.length) {
            const image = new Image();
            image.src = selectedFile.url;
            image.onload = () => {
              const configuredData = [];
              const annotUpdates = {};
              loadedData.forEach((prevData) => {
                prevData.data.split('\n').forEach((entry, i) => {
                  const line = entry.split(' ');
                  if (line.length >= 5) {
                    let [cls, x, y, width, height] = line;

                    const className = labelsRef.current?.find(
                      (ele) => ele.id == cls
                    )?.name;

                    // const color = getRandomHexColor();

                    // const color = rectangleColor.all[i].color;
                    const id = prevData.imageId;
                    const uuid = v4();
                    console.log({all: rectangleColor.all})
                    const color = rectangleColor.all.find(
                      (obj) => obj.name === className
                    );
                    configuredData.push({
                      ...BASE_RECT,
                      id: selectedRoisRef.current.length + i,
                      fill: color?.color,
                      stroke: color?.color,
                      imageId: id,
                      rectType: RECTANGLE_TYPE.ANNOTATION_LABEL,
                      // roiId: roi.id,
                      title: className,
                      x: parseFloat(x - width / 2),
                      y: parseFloat(y - height / 2),
                      width: parseFloat(width),
                      height: parseFloat(height),
                      uuid,
                    });
                    annotUpdates[uuid] = cls;
                  }
                });
              });
              // console.log('UPdate from txt', annotUpdates, configuredData);
              setAnnotationMap((prev) => ({ ...prev, ...annotUpdates }));
              setRectangle((prev) => [...prev, ...configuredData]);
              setInitialLabels(configuredData);
            };
          }
        } catch (e) {}
      };
      getData();
    }
  }, [selectedFile, rectangleColor, loadedLabelData]);

  React.useEffect(() => {
    labelsRef.current = labelClasses;
  }, [labelClasses]);

  console.log(
    { selectedRois },
    { initialLabels },
    { selectedPolyId },
    { labelId }
  );

  const renderLabelHeading = () => {
    if(type !== ASSEMBLY_CONFIG.MOVING)return <></>
    return <div className="mb-4 flex flex-col gap-4">
      <p className='font-medium'>First label the Primary Object Class in the image</p>
      <div className="mb-4 flex gap-4">
        <Button
          size="tiny"
          variant="border"
          onClick={() => addPrimaryClass([...rectangleColor.all])}
          fullWidth={false}
        >
          <div className="flex items-center justify-center gap-2">
            <Plus size={18} /> Add Primary Object Annotation
          </div>
        </Button>
        {/* )} */}
      </div>
      <div className="flex flex-col gap-2">
        {labelClasses.map((t, index) => {
          const labelIdx = labelClasses.filter(cl => cl.id == t.id).findIndex(r => r?.color === t?.color);
          console.log({labelIdx, selectedPrimaryRois})
          if(t.id !== configuration.primaryObjectClass)return <></>
          return (
            <div className="flex items-center gap-2">
              <Label main={false}>Primary Object Class Annotation {labelIdx+1}:</Label>
              <div className="ml-2 w-44 max-w-xs">
                <Button
                  size="tiny"
                  color={genLabelClass(t?.color === selectedLabel?.color ? selectedLabel?.status : t?.status)}
                  fullWidth={false}
                  onClick={(e) => {
                    if(labelIdx > -1 && selectedPrimaryRois.length - 1 >= labelIdx){
                      if (isEditing) {
                        toast(
                          'Please confirm the creation of the new label first before proceeding',
                          {
                            icon: '⚠️',
                          }
                        );
                        return;
                      }
                      setSelectedPloyId(selectedPrimaryRois[labelIdx].uuid);
                      setLabelsEdited((prev) => ({ ...prev, [selectedPrimaryRois[labelIdx].imageId]: true }));
                    }else{
                      handleClassClick(e, index, t.color);
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Pen /> Label Class
                  </div>
                </Button>
              </div>
              <Trash
                size={18}
                className="cursor-pointer"
                onClick={() => {
                  if(labelIdx > -1 && selectedPrimaryRois.length - 1 >= labelIdx){
                    if (isEditing && labelId === selectedPrimaryRois[labelIdx].uuid) {
                      removeRectangle(selectedPrimaryRois[labelIdx].uuid, selectedPrimaryRois[labelIdx].imageId);
                      setIsEditing(false);
                    } else if (isEditing) {
                      toast(
                        'Please confirm the creation of the new label first before proceeding',
                        {
                          icon: '⚠️',
                        }
                      );
                    } else {
                      removeRectangle(selectedPrimaryRois[labelIdx].uuid, selectedPrimaryRois[labelIdx].imageId);
                    }
                  }
                  setLabelClasses(prev => {
                    const newPrev = [...prev];
                    return newPrev.filter(p => p.color !== t.color)
                  })
                }}
              />
            </div>
          )
        })}
      </div>
      <Hr />
    </div>
  }

  console.log({selectedRois, labelClasses, selectedLabelIdx})

  return (
    <div className="flex grow flex-col gap-4">
      {renderLabelHeading()}
      <p className='font-medium mt-5'>Choose the class below you wish to label in the image</p>
      <ul className="flex flex-wrap gap-4">
        {labelClasses.map((t, index) => {
          if(t.id === configuration.primaryObjectClass)return <></>
          return (
            <li
              key={t.name}
              className={`bg-[${t.color}] flex items-center gap-1 cursor-pointer rounded-md px-3 py-1.5`}
              style={{ backgroundColor: t.color }}
              onClick={(e) => {
                handleClassClick(e, index, t.color);
              }}
            >
              <Box size="xs" />
              {t.name}
            </li>
          )
        })}
      </ul>

      <div className='mt-2'>
        Current labels for{' '}
        <span className="font-semibold">{selectedImage?.fileName}</span>
      </div>
      <div className="flex grow flex-col gap-4 overflow-y-auto">
        {selectedRois
          .filter((e) => e.rectType !== RECTANGLE_TYPE.ROI && e.title !== configuration.primaryObject)
          .map((t, i) => (
            <div key={t.id} className="flex items-center gap-4 ">
              <span>{i + 1}.</span>
              <div className=" flex grow">
                {/* <div
                  className={`w-full max-w-sm ${t.action === 'RECTANGLE' && isEditing &&
                   selectedRois.length !== initialLabels.length && labelId === t.uuid && t.id === selectedRois.length - 1 ? 'border border-red-700 rounded-lg' : ''}`}
                > */}
                <div
                  className={`w-full max-w-sm ${labelId === t.uuid ? 'rounded-lg border border-blue-700' : ''}`}
                >
                  <Select
                    size="sm"
                    options={labelClasses}
                    placeholder="Select class"
                    value={annotationMap[t.uuid]}
                    disabled={isEditing ? true : false}
                    onChange={(e) => {
                      const ind = rectangles.findIndex(
                        (ele) =>
                          ele.uuid == t.uuid &&
                          ele.rectType == RECTANGLE_TYPE.ANNOTATION_LABEL
                      );
                      const recCp = [...rectangles];

                      const labelClass = labelClasses.find(
                        (ele) => ele.id == e.target.value
                      );
                      recCp[ind] = {
                        ...recCp[ind],
                        title: labelClass.name,
                        stroke: labelClass.color,
                        fill: labelClass.color,
                      };
                      setRectangle(recCp);
                      setAnnotationMap({
                        ...annotationMap,
                        [t.uuid]: e.target.value,
                      });
                      setLabelsEdited((prev) => ({
                        ...prev,
                        [t.imageId]: true,
                      }));
                    }}
                  />
                </div>
              </div>
              <Edit
                size={18}
                className="mr-4 cursor-pointer"
                onClick={() => {
                  if (isEditing) {
                    toast(
                      'Please confirm the creation of the new label first before proceeding',
                      {
                        icon: '⚠️',
                      }
                    );
                    return;
                  }
                  setSelectedPloyId(t.uuid);
                  setLabelsEdited((prev) => ({ ...prev, [t.imageId]: true }));
                }}
              />
              <Trash
                size={18}
                className="cursor-pointer"
                onClick={() => {
                  if (isEditing && labelId === t.uuid) {
                    removeRectangle(t.uuid, t.imageId);
                    setIsEditing(false);
                  } else if (isEditing) {
                    toast(
                      'Please confirm the creation of the new label first before proceeding',
                      {
                        icon: '⚠️',
                      }
                    );
                  } else {
                    removeRectangle(t.uuid, t.imageId);
                  }
                }}
              />
            </div>
          ))}
      </div>
      <div className="sticky bottom-0 flex flex-col items-center gap-2 bg-white">
        <ResultPagination total={10} page={page} setPage={setPageNum} />
        <Button
          size="sm"
          variant="flat"
          onClick={save}
          style={{ width: '260px' }}
          className="mb-2"
        >
          Save
        </Button>
      </div>
    </div>
  );
}
