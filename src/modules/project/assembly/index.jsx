import Button from '@/shared/ui/Button';

import UploadImage from './components/UploadImage';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import {
  ACTION_NAMES,
  ASSEMBLY_CONFIG,
  BASE_RECT,
  DEFAULT_ASSEMBLY,
  DEFAULT_ROI,
  RECTANGLE_TYPE,
  STATUS,
} from '@/core/constants';
import Steps from './components/Steps';
import UploadImageStep from './upload-image-step';
import InspectionParameterStep from './inspection-parameter-step';
import LabelImage from './label-image-step';
import PreTrainingStep from './pre-training-step';
import ProjectCreateLoader from '@/shared/ui/ProjectCreateLoader';
import Actions from './components/Actions';
import { useParams } from 'react-router-dom';

import { editingRectAtom, initialLabelsAtom, loadedLabelsAtom, stepAtom } from './state';
import React, { useEffect, useRef, useState } from 'react';
import axiosInstance from '@/core/request/aixosinstance';
import {
  annotationMapAtom,
  assemblyAtom,
  currentRectangleIdAtom,
  currentRoiIdAtom,
  editingAtom,
  labelEditedAtom,
  lastActionNameAtom,
  rectanglesAtom,
  rectanglesTypeAtom,
  uploadedFileListAtom,
} from '../state';
import { useNavigate } from 'react-router-dom';
import { cloneDeep } from 'lodash';
import toast from 'react-hot-toast';
import { getRandomHexColor } from '@/util/util';
import { v4 } from 'uuid';

export default function Assembly() {
  const [isEditing, setIsEditing] = useRecoilState(editingAtom);
  const setRectangleType = useSetRecoilState(rectanglesTypeAtom);

  const { projectId, configurationId } = useParams();

  const [uploadedFileList, setUploadedFileList] = useRecoilState(uploadedFileListAtom);

  const [type, setType] = useState(ASSEMBLY_CONFIG.STATIONARY);
  const [configuration, setConfiguration] = useRecoilState(assemblyAtom);

  const [currentRoiId, setCurrentRoiId] = useRecoilState(currentRoiIdAtom);

  const [isEditingRect, setEditingRect] = useRecoilState(editingRectAtom);

  const [step, setStep] = useRecoilState(stepAtom);
  const rois = useRecoilValue(rectanglesAtom).filter(
    (t) => t.rectType == RECTANGLE_TYPE.ROI
  );
  const annotationRects = useRecoilValue(rectanglesAtom).filter(
    (t) => t.rectType == RECTANGLE_TYPE.ANNOTATION_LABEL
  );
  const [annotationMap, setAnnotationMap] = useRecoilState(annotationMapAtom);
  const [selectedRectId, setSelectedRectId] = useRecoilState(
    currentRectangleIdAtom
  );
  const setLastAction = useSetRecoilState(lastActionNameAtom);
  const [rectangles, setRectangles] = useRecoilState(rectanglesAtom);
  const setLabelsLoaded = useSetRecoilState(loadedLabelsAtom);
  const [labelsEdited, setLabelsEdited] = useRecoilState(labelEditedAtom);
  const [roisLoaded, setRoisLoaded] = useState(false);

  const [initialLabels, setInitialLabels] = useRecoilState(initialLabelsAtom);

  const getProject = async () => {
    try {
      const { data } = await axiosInstance.get('/project', {
        params: {
          projectId,
        },
      });
      !data.data.isItemFixed && setType(ASSEMBLY_CONFIG.MOVING);
      console.log(configuration, data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const [images, setImages] = useRecoilState(uploadedFileListAtom);

  const canGoNext = !(
    images.length !== 10 ||
    (step == 0 && images.some((img) => !img))
  );
  const navigate = useNavigate();

  const compareArrays = (annotRects, iniLabels) => {
    let flag = false;

    for (let rect of annotRects) {
      let initialLabel = iniLabels.find(label => label.uuid === rect.uuid);
      if (initialLabel) {
        if (
          rect.x !== initialLabel.x ||
          rect.y !== initialLabel.y ||
          rect.width !== initialLabel.width ||
          rect.height !== initialLabel.height
        ) {
          flag = true;
          break;
        }
      } else {
        flag = true;
        break;
      }
    }
    return flag;
  }

  const updateAnnotation = async () => {
    const imgMap = {};
    if (Object.keys(labelEditedAtom).length == 0) {
      return;
    }
    console.log({ annotationRects }) // has all the label rectangles
    console.log("initial", initialLabels)
    if (initialLabels.length === annotationRects.length
      && !compareArrays(annotationRects, initialLabels)) {
      toast.success('No changes to update');
      return true;
    }

    // if(initialLabels.length === annotationRects.length) {
    //   toast.success('my check');
    //   return true;
    // }
    annotationRects.forEach((rect) => {
      if (!labelsEdited[rect.imageId]) return;
      const classNo = annotationMap[rect.uuid];
      const height = rect.height.toFixed(4);
      const width = rect.width.toFixed(4);
      const x = (rect.x + rect.width / 2).toFixed(4);
      const y = (rect.y + rect.height / 2).toFixed(4);
      console.log("files", { classNo, height, width, x, y });
      // console.log("rect.imageId",rect.imageId)
      if (imgMap[rect.imageId]) {
        imgMap[rect.imageId] += `${classNo} ${x} ${y} ${width} ${height}\n`;
      } else {
        imgMap[rect.imageId] = `${classNo} ${x} ${y} ${width} ${height}\n`;
      }
    });
    const formData = new FormData();
    const imageIds = [];
    // console.log({images}) // conatins the 10 uploaded images
    images.forEach((img, index) => {
      if (imgMap[img.id]?.length || labelsEdited[img.id]) {
        // console.log("length of imgMap:", imgMap[img.id]?.length, "labelsEdited:", labelsEdited[img.id])
        const fileContents = imgMap[img.id] || '';
        console.log({ fileContents })
        const fileBlob = new Blob([fileContents], { type: 'text/plain' });
        formData.append('files', fileBlob, img.id);
        imageIds.push(img.id || '');
      }
    });
    // console.log("newFileContent",{newFileContent})
    // console.log({imageIds})
    // console.log("imgMap",{imgMap})
    formData.append('configurationId', configurationId);
    formData.append('imageIds', imageIds);
    console.log({ imageIds })
    if (!imageIds.length) {
      toast.success('No changes to update');
      return true;
    }
    try {
      const data = await axiosInstance.post(
        '/configuration/upload-label-files',
        formData
      );
      toast.success('Labels updated');
      setLabelsEdited({});
      setInitialLabels(annotationRects)
      console.log("final", initialLabels);
      return data.data?.success;
    } catch (e) {
      toast.error(
        e?.response?.data?.data?.message
          ? `${e?.response?.data?.data?.message}. All fields are required`
          : 'Failed'
      );
    }
  };

  const nextRef = useRef();

  const handleNext = async () => {
    let t = step;
    if (!canGoNext) t = 0;
    else if (t == 0) {
      await getRois();
      t++;
    } else if (t == 1) {
      if (nextRef.current) {
        const res = await nextRef.current.handleSubmit();
        console.log('res:', res);
        if (res) return;
      }
      t = (await prepareApiData()) ? t + 1 : t;
    } else if (t == 2) {
      t = (await updateAnnotation()) ? t + 1 : t;
    } else if (t == 3) {
      navigate(-1);
    } else if (t != 3) t += 1;
    console.log(step);
    setStep(t);
  };

  const handlePrev = () => {
    setStep((t) => {
      if (t == 0) return t;
      return t - 1;
    });
  };

  const calcHeight = () => {
    return (window.innerHeight * 11) / 12 - 154;
  };

  const cancel = () => {
    setEditingRect(false);
    setIsEditing(false);
    // setLabelsEdited({});
    setCurrentRoiId(null);
    setRectangleType(RECTANGLE_TYPE.ROI);
    setLastAction(ACTION_NAMES.CANCEL);
    setConfiguration((t) => ({
      ...t,
      rois: t.rois.map((k) => ({
        ...k,
        status: k.id == currentRoiId ? STATUS.DEFAULT : k.status,
      })),
    }));
  };

  const submit = () => {
    setEditingRect(false);
    setIsEditing(false);
    setCurrentRoiId(null);
    setSelectedRectId(null);
    setLastAction(ACTION_NAMES.SUBMIT);
    setConfiguration((t) => ({
      ...t,
      rois: t.rois.map((k) => ({
        ...k,
        status: k.id == currentRoiId ? STATUS.FINISH : k.status,
      })),
    }));
    setRectangleType(RECTANGLE_TYPE.ROI);
  };

  const stepObj = {
    0: <UploadImageStep />,
    1: <InspectionParameterStep type={type} nextRef={nextRef} />,
    2: <LabelImage save={updateAnnotation} />,
    3: <PreTrainingStep />,
  };

  const getRois = async () => {
    if (roisLoaded) return true;
    try {
      const roiData = await axiosInstance.get('/configuration/classes', {
        params: {
          configurationId,
        },
      });
      const data = JSON.parse(roiData.data.data?.data);
      const temp = [...data];
      temp.length &&
        temp.map((item, index) => {
          console.log('inside map:', item);
          setConfiguration((prev) => ({
            ...prev,
            productFlow: item.configuration.direction,
          }));
          if (item.parts.isTracker) {
            console.log('updating config');
            setConfiguration((prev) => ({
              ...prev,
              primaryObject: item.parts.name,
              primaryObjectClass: item.parts.classId,
              direction: item.configuration.direction,
            }));
            data.splice(index, 1);
          }
        });
      console.log('data here:', data);
      if (data.length) {
        const partsMap = {};
        const roiMap = {};
        const rects = [];
        // let configUpdate = { productFlow: data[0].configuration.direction },
        //   configUpdateRequired = false;
        data?.forEach((conf, i) => {
          const roiId = conf.rois.id;
          console.log('Loop', roiId);
          if (!roiMap[roiId]) {
            console.log('roi id not present');
            roiMap[roiId] = {
              id: i,
              identity: roiId,
              checked: false,
              status: STATUS.FINISH,
              open: true,
              parts: [],
            };
            //!do rectangle here too
            console.log('before');
            const { x1, x2, y1, y2 } = conf.rois;
            console.log('before');
            const color = getRandomHexColor();
            const uuid = v4();
            rects.push({
              ...BASE_RECT,
              id: rois.length + i,
              fill: color,
              stroke: color,
              imageId: images[0].id,
              rectType: RECTANGLE_TYPE.ROI,
              roiId: i,
              title: conf.rois.name,
              x: parseFloat(x1),
              y: parseFloat(y1),
              width: parseFloat(x2 - x1),
              height: parseFloat(y2 - y1),
              uuid,
            });
          }
          if (!partsMap[roiId]) {
            partsMap[roiId] = [];
          }
          console.log('doing parts');
          // if (conf.parts.isTracker) {
          //   configUpdateRequired = true;
          //   configUpdate = {
          //     ...configUpdate,
          //     primaryObject: conf.parts?.name || '',
          //     primaryObjectClass: conf.parts?.name || '',
          //   };
          // }
          partsMap[roiId].push({
            id: i,
            objectName: conf.parts?.name || '',
            class: conf.parts?.classId || '',
            className: conf.assembly_class?.name || '',
            operation: conf.parts?.operator,
            qty: conf.parts?.count,
            classify: conf.assembly_class?.classify ? 'on' : false,
            checked: false,
            open: true,
          });
        });
        for (let roiId in roiMap) {
          roiMap[roiId].parts = partsMap[roiId];
        }
        setConfiguration((t) => ({
          ...t,
          rois: Object.values(roiMap),
        }));
        setRectangles((prev) => [...prev, ...rects]);
        // if (configUpdateRequired) {
        //   setConfiguration((prev) => ({
        //     ...prev,
        //     ...configUpdate,
        //   }));
        // }
      }
      return true;
    } catch (e) {
      return false;
    } finally {
      setRoisLoaded(true);
    }
  };

  useEffect(() => {
    setLabelsEdited({});
    getProject();

    return () => {
      uploadedFileList.forEach((value) => {
        URL.revokeObjectURL(value.url);
      });
      setUploadedFileList([]);
    }
  }, []);

  const prepareApiData = async () => {
    const imgMap = {};
    const temp = cloneDeep(configuration);
    temp.direction = parseInt(temp.productFlow);
    temp.id = configurationId;
    delete temp.productFlow;
    temp.rois = temp.rois.map((roi, index) => {
      const tempParts = roi.parts.map((part) => {
        return {
          classify: part.classify == 'on',
          class: part.class,
          name: part.objectName,
          count: part.qty,
          operator: part.operation,
        };
      });
      let x1, x2, y1, y2;
      console.log(
        roi.id,
        rois.map((ele) => ele.roiId)
      );
      rois.forEach((roiRect) => {
        if (roi.id == roiRect.roiId) {
          x1 = parseFloat(roiRect.x.toFixed(4));
          x2 = parseFloat((roiRect.x + roiRect.width).toFixed(4));
          y1 = parseFloat(roiRect.y.toFixed(4));
          y2 = parseFloat((roiRect.y + roiRect.height).toFixed(4));
        }
      });
      return {
        id: roi?.identity || '',
        name: `ROI ${index}`,
        x1,
        x2,
        y1,
        y2,
        parts: tempParts,
      };
    });
    if (temp.direction != 0) {
      temp.rois[0].primaryObject = {
        name: temp.primaryObject,
        class: temp.primaryObjectClass,
      };
    }
    delete temp.primaryObject;
    delete temp.primaryObjectClass;
    const formData = new FormData();
    // await Promise.all(images.map(async(img, index)=>{
    //   const resp = await fetch(img.url)
    //   const blob = await resp.blob()
    //   formData.append('images', blob, img.name)
    // }))
    formData.append('data', JSON.stringify(temp));
    formData.append('configurationId', configurationId);
    formData.append(
      'isGood',
      JSON.stringify([
        true,
        true,
        true,
        true,
        true,
        false,
        false,
        false,
        false,
        false,
      ])
    );
    try {
      const data = await axiosInstance.post(
        '/configuration/assembly',
        formData
      );
      toast.success('ROIs uploaded');
      return data.data?.success;
    } catch (e) {
      toast.error(
        e?.response?.data?.data?.message
          ? // ? `${e?.response?.data?.data?.message}. All fields are required`
          'All ROIs label are required!'
          : 'Failed'
      );
    }
  };

  let imageIdStore = new Set();
  rectangles.forEach((rect) => {
    rect.imageId &&
      rect.rectType == RECTANGLE_TYPE.ANNOTATION_LABEL &&
      imageIdStore.add(rect.imageId);
  });
  const isAllImagesLabeled = imageIdStore.size == 10;
  console.log({ uploadedFileList })

  return (
    <>
      <div className="grid h-screen grid-cols-12 ">
        <div
          className={`col-span-${step === 3 ? '12 px-10' : '5'} bg-white grid grid-rows-12 border-r-[1px] border-gray-400`}
          style={{ maxHeight: '100vh', overflow: 'hidden' }}
        >
          <div
            className={`row-span-11 flex flex-col ${step === 3 ? 'w-[85%] mx-auto my-2' : ''}`}
            style={{ maxHeight: '91.65vh', overflowY: 'auto' }}
          >
            <h1 className="mb-4 px-6 pt-6 text-3xl font-bold">
              Assembly Configuration
            </h1>

            <Steps />

            <div
              className="flex grow flex-col p-6 pb-0"
              style={
                {
                  // height: calcHeight(),
                }
              }
            >
              {stepObj[step]}
            </div>
          </div>

          <div className=" flex justify-center border-t-[1px] border-gray-400 bg-white">
            <div className="flex max-w-md flex-1 items-center justify-center gap-4">
              <Button size="xs" variant="flat" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              {step > 0 && (
                <Button size="xs" variant="border" onClick={handlePrev}>
                  Back
                </Button>
              )}
              {canGoNext && (
                <Button
                  size="xs"
                  onClick={() => {
                    if (step == 2) {
                      isAllImagesLabeled && handleNext();
                    } else {
                      handleNext();
                    }
                  }}
                  className={
                    !isAllImagesLabeled && step == 2
                      ? 'cursor-not-allowed bg-slate-400 hover:bg-slate-400'
                      : ''
                  }
                >
                  {step == 3 ? 'Finish' : 'Next'}
                </Button>
              )}
            </div>
          </div>
        </div>

        {step !== 3 && (
          <div className="col-span-7 grid grid-rows-12">
            <div
              className="row-span-11 flex flex-col items-center justify-center gap-4 bg-[#EAEDF1]"
              style={{ overflow: 'hidden' }}
            >
              <UploadImage />
            </div>

            <div className="flex items-center justify-between border-t-[1px] border-gray-400 bg-white">
              <Actions cancel={cancel} submit={submit} />
            </div>
          </div>
        )}
      </div>
      {false && (
        <ProjectCreateLoader title="Please wait while we analyse the project..." />
      )}
    </>
  );
}
