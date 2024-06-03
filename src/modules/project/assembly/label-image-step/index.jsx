import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit,
  Trash,
} from 'react-feather';
import Select from '@/shared/ui/Select';
import {
  actionStatusAtom,
  annotationMapAtom,
  assemblyAtom,
  cachedFileListAtom,
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
import { ACTION_NAMES, BASE_RECT, RECTANGLE_TYPE } from '@/core/constants';
import Button from '@/shared/ui/Button';
import axiosInstance from '@/core/request/aixosinstance';
import { useParams } from 'react-router-dom';
import { getRandomHexColor } from '@/util/util';
import {
  initialLabelsAtom,
  loadedLabelsAtom,
  rectangleColorAtom,
  stepAtom,
} from '../state';
import Pagination from '@/shared/ui/Pagination';
import { v4 } from 'uuid';
import ResultPagination from '@/shared/ui/ResultPagination';

export default function LabelImage({ save }) {
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
  const [annotationMap, setAnnotationMap] = useRecoilState(annotationMapAtom);
  const [selectedLabel, setLabel] = useRecoilState(labelClassAtom);
  const setRectangleType = useSetRecoilState(rectanglesTypeAtom);

  const selectedImage = useRecoilValue(selectedFileAtom);

  const setIsEditing = useSetRecoilState(editingAtom);
  
  const images = useRecoilValue(cachedFileListAtom);

  const [selectedFile, setSelectedFile] = useRecoilState(selectedFileAtom);
  const [rectangles, setRectangle] = useRecoilState(rectanglesAtom);
  const [initialLabels, setInitialLabels] = useRecoilState(initialLabelsAtom);

  let selectedRois = rectangles.filter(
    (rect) =>
      rect.rectType == RECTANGLE_TYPE.ANNOTATION_LABEL &&
      rect.imageId == selectedFile?.id
  );

  console.log({ selectedRois });

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
    console.log({ imageId });
    setRectangle((t) => t.filter((k) => k.uuid !== uuid));
    // setRectangleColor((t) => t.filter((k) => k.name !== name))
    const temp = { ...annotationMap };
    delete temp[uuid];
    setAnnotationMap(temp);
    setLabelsEdited((prev) => ({ ...prev, [imageId]: true }));
  };

  useEffect(() => {
    addClasses();
  }, []);

  console.log({ labelEdited });
  console.log({ initialLabels });

  const getUniqueHexColor = (colors) => {
    let hexColor;
    do {
      hexColor = getRandomHexColor();
    } while (colors.map((col) => col.color).includes(hexColor));
    return hexColor;
  };

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
          // console.log('find', { rectangleColor });
          const findColor = rectangleColor.all.find(
            (obj) => obj.name === key
          )?.color;
          console.log({ findColor });
          const color = findColor ? findColor : getUniqueHexColor(colors);
          // console.log("find",rectangleColor.all.find((obj) => obj.name === key)?.color)
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
    console.log('xx', { labelClasses });
    // console.log('rect length', rectangleColor.all.length, { rectangleColor });
    // console.log('color length', colors.length, { colors });

    setRectangleColor((prev) => ({
      ...prev,
      all: prev.all.length === colors.length ? [...prev.all] : colors,
    }));
  };

  // console.log({ rectangleColor });

  const handleClassClick = async (e, i, col) => {
    console.log('label class clicked');
    setIsEditing(true);
    setRectangleType(RECTANGLE_TYPE.ANNOTATION_LABEL);
    setRectangleColor({
      ...rectangleColor,
      selectedColor: col,
    });
    const update = {
      name: labelClasses[i].name,
      count: labelClasses[i].count,
      id: labelClasses[i].id,
      color: col,
    };
    console.log('setLabel', update);
    setLabel(update);
    selectedLabelRef.current = {
      name: labelClasses[i].name,
      count: labelClasses[i].count,
      id: labelClasses[i].id,
      color: col,
    };
  };

  const curIndex = images.findIndex((image) => image.id == selectedFile.id);

  const changeImageFile = (next = true) => {
    if (next && curIndex + 1 < images.length) {
      setSelectedFile(images[curIndex + 1]);
    }
    if (!next && curIndex > 0) {
      setSelectedFile(images[curIndex - 1]);
    }
  };

  const setPageNum = (p) => {
    setSelectedFile(images[p-1]);
    setPage(p);
  }

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
        // console.log(annotations, prev)
        console.log('annotations: ', annotations);
        annotations.forEach((annot) => {
          updates[annot.uuid] = selectedLabel.id;
          updates[annot.stroke] = selectedLabel.color;
        });
        return { ...prev, ...updates };
      });
    }
    if (annotations.length) {
      setSelectedPloyId(annotations[0].uuid);
    }

    console.log({ selectedRois });
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
          console.log({ data });
          const loadedData = data?.data.data;
          if (loadedData.length) {
            // console.log(loadedData, "got data"); return;
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
                    // console.log('hello', className, cls, rectangleColor.all);
                    // console.log("hello1", {className})

                    // const color = getRandomHexColor();

                    // const color = rectangleColor.all[i].color;
                    const id = prevData.imageId;
                    const uuid = v4();
                    const color = rectangleColor.all.find(
                      (obj) => obj.name === className
                    );
                    console.log('1', { color });
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
              console.log('UPdate from txt', annotUpdates, configuredData);
              setAnnotationMap((prev) => ({ ...prev, ...annotUpdates }));
              setRectangle((prev) => [...prev, ...configuredData]);
              setInitialLabels(configuredData)
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

  return (
    <div className="flex grow flex-col gap-4">
      <p>Choose the class below you wish to label in the image</p>
      <ul className="flex flex-wrap gap-4">
        {labelClasses.map((t, index) => (
          <li
            key={t.name}
            className={`bg-[${t.color}] cursor-pointer rounded-md px-3 py-1.5`}
            style={{ backgroundColor: t.color }}
            onClick={(e) => {
              handleClassClick(e, index, t.color);
            }}
          >
            {t.name}
          </li>
        ))}
      </ul>

      <div>
        Current labels for{' '}
        <span className="font-semibold">{selectedImage.fileName}</span>
      </div>
      <div className="flex grow flex-col gap-4 overflow-y-auto">
        {selectedRois
          .filter((e) => e.rectType !== RECTANGLE_TYPE.ROI)
          .map((t, i) => (
            <div key={t.id} className="flex items-center gap-4 ">
              <span>{i + 1}.</span>
              <div className=" flex grow">
                <div className=" w-full max-w-sm">
                  <Select
                    size="sm"
                    options={labelClasses}
                    placeholder="Select class"
                    value={annotationMap[t.uuid]}
                    onChange={(e) => {
                      //!update rectangle class tooo, title
                      const ind = rectangles.findIndex(
                        (ele) =>
                          ele.uuid == t.uuid &&
                          ele.rectType == RECTANGLE_TYPE.ANNOTATION_LABEL
                      );
                      const recCp = [...rectangles];

                      recCp[ind] = {
                        ...recCp[ind],
                        title: labelClasses.find(
                          (ele) => ele.id == e.target.value
                        ).name,
                      };
                      // console.log("hii",recCp[ind].title)
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
                  setSelectedPloyId(t.uuid);
                  setLabelsEdited((prev) => ({ ...prev, [t.imageId]: true }));
                }}
              />
              <Trash
                size={18}
                className="cursor-pointer"
                onClick={() => {
                  removeRectangle(t.uuid, t.imageId);
                }}
              />
            </div>
          ))}
      </div>
      <div className="sticky bottom-0 flex flex-col items-center gap-2 bg-white">
        <ResultPagination total={10} page={page} setPage={setPageNum}/>
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
