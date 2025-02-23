import Button from '@/shared/ui/Button';

import UploadImage from './components/UploadImage';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import {
  ACTION_NAMES,
  ASSEMBLY_CONFIG,
  BASE_RECT,
  DEFAULT_ROI,
  RECTANGLE_TYPE,
  STATUS,
} from '@/core/constants';
import Steps from './components/Steps';
import InspectionParameterStep from './inspection-parameter-step';
import LabelImage from './label-image-step';
import PreTrainingStep from './pre-training-step';
import ProjectCreateLoader from '@/shared/ui/ProjectCreateLoader';
import Actions from './components/Actions';
import { useParams } from 'react-router-dom';

import {
  captureAtom,
  editingRectAtom,
  initialLabelsAtom,
  loadedLabelsAtom,
  prevStatusAtom,
  rectangleColorAtom,
  stepAtom,
} from './state';
import { useEffect, useRef, useState } from 'react';
import axiosInstance from '@/core/request/aixosinstance';
import {
  annotationMapAtom,
  assemblyAtom,
  currentLabelIdAtom,
  currentRectangleIdAtom,
  currentPolygonIdAtom,
  currentRoiIdAtom,
  editingAtom,
  labelClassAtom,
  labelEditedAtom,
  lastActionNameAtom,
  rectanglesAtom,
  polygonsAtom,
  rectanglesTypeAtom,
  polygonsTypeAtom,
  uploadedFileListAtom,
  imageStatusAtom,
  selectedFileAtom,
  inspectionReqAtom,
  imgBrightnessAtom,
  cachedFileListAtom,
} from '../state';
import { useNavigate } from 'react-router-dom';
import { cloneDeep } from 'lodash';
import toast from 'react-hot-toast';
import {
  compareArrays,
  getAverageBrightness,
  getRandomHexColor,
} from '@/util/util';
import { v4 } from 'uuid';
import UploadImagesStep from './upload-image-step/index';
import ErrorModal from '@/shared/ui/ErrorModal';
import LocalModal from '@/shared/ui/LocalModal';

export default function Assembly() {
  const [isEditing, setIsEditing] = useRecoilState(editingAtom);
  const setRectangleType = useSetRecoilState(rectanglesTypeAtom);
  const setPolygonType = useSetRecoilState(polygonsTypeAtom);
  const setImageBrightness = useSetRecoilState(imgBrightnessAtom);

  const [nextLoader, setNextLoader] = useState(false);
  const [error, setError] = useState('');

  const { projectId, configurationId } = useParams();

  const [uploadedFileList, setUploadedFileList] =
    useRecoilState(uploadedFileListAtom);

  const [type, setType] = useState(ASSEMBLY_CONFIG.STATIONARY);
  const [configuration, setConfiguration] = useRecoilState(assemblyAtom);

  const [currentRoiId, setCurrentRoiId] = useRecoilState(currentRoiIdAtom);

  const [isEditingRect, setEditingRect] = useRecoilState(editingRectAtom);

  const [labelClass, setLabelClass] = useRecoilState(labelClassAtom);

  const [step, setStep] = useRecoilState(stepAtom);

  const [imageStatus, setImageStatus] = useRecoilState(imageStatusAtom);

  const [selectedImage, setSelectedImage] = useRecoilState(selectedFileAtom);
  const [position, setPosition] = useRecoilState(captureAtom);
  // const [images, setImages] = useRecoilState(uploadedFileListAtom);

  // const rois = useRecoilValue(rectanglesAtom).filter(
  //   (t) => t.rectType == RECTANGLE_TYPE.ROI
  // );

  const rois = [
    ...useRecoilValue(rectanglesAtom).filter(
      (t) => t.rectType === RECTANGLE_TYPE.ROI
    ),
    ...useRecoilValue(polygonsAtom).filter(
      (t) => t.polyType === RECTANGLE_TYPE.ROI
    ),
  ];

  // const annotationRects = useRecoilValue(rectanglesAtom).filter(
  //   (t) => t.rectType == RECTANGLE_TYPE.ANNOTATION_LABEL
  // );

  const annotationRects = [
    ...useRecoilValue(rectanglesAtom).filter(
      (t) => t.rectType === RECTANGLE_TYPE.ANNOTATION_LABEL
    ),
    ...useRecoilValue(polygonsAtom).filter(
      (t) => t.polyType === RECTANGLE_TYPE.ANNOTATION_LABEL
    ),
  ];

  // const recValue = useRecoilValue(rectanglesAtom);
  // const polyValue = useRecoilValue(polygonsAtom);
  // console.log("all figures",{rois, annotationRects, recValue, polyValue})

  const [annotationMap, setAnnotationMap] = useRecoilState(annotationMapAtom);
  const [selectedRectId, setSelectedRectId] = useRecoilState(
    currentRectangleIdAtom
  );
  const [selectedPolyId, setSelectedPolyId] =
    useRecoilState(currentPolygonIdAtom);
  const setLastAction = useSetRecoilState(lastActionNameAtom);
  const [rectangles, setRectangles] = useRecoilState(rectanglesAtom);
  const [polygons, setPolygons] = useRecoilState(polygonsAtom);
  const setLabelsLoaded = useSetRecoilState(loadedLabelsAtom);
  const [labelsEdited, setLabelsEdited] = useRecoilState(labelEditedAtom);
  const [roisLoaded, setRoisLoaded] = useState(false);
  const [reloadRoisLoader, setReloadRoisLoader] = useState(false);

  const [initialLabels, setInitialLabels] = useRecoilState(initialLabelsAtom);
  const [labelId, setLabelId] = useRecoilState(currentLabelIdAtom);
  const [initialRectangles, setInitialRectnagles] = useState([]);
  const setCapturePosition = useSetRecoilState(captureAtom);

  const [rectangleColor, setRectangleColor] =
    useRecoilState(rectangleColorAtom);

  const [prevStatus, setPrevStatus] = useRecoilState(prevStatusAtom);

  const setInspectionReq = useSetRecoilState(inspectionReqAtom);

  const getProject = async () => {
    try {
      const { data } = await axiosInstance.get('/project', {
        params: {
          projectId,
        },
      });
      !data.data.isItemFixed && setType(ASSEMBLY_CONFIG.MOVING);
    } catch (error) {
      console.log(error);
    }
  };
  const [images, setImages] = useRecoilState(uploadedFileListAtom);
  const cachedImages = useRecoilValue(cachedFileListAtom);

  const canGoNext = !(
    images.length !== 10 ||
    (step == 0 && images.some((img) => !img)) ||
    !selectedImage
  );
  const navigate = useNavigate();

  const updateAnnotation = async () => {
    const imgMap = {};
    if (Object.keys(labelEditedAtom).length == 0) {
      return;
    }

    if (isEditing) {
      toast(
        'Please confirm the creation of the new label first before proceeding',
        {
          icon: '⚠️',
        }
      );
      return;
    }
    // console.log({ annotationRects }); // has all the label rectangles

    if (
      initialLabels.length === annotationRects.length &&
      !compareArrays(annotationRects, initialLabels)
    ) {
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
      if (!rect?.points) {
        const height = rect.height.toFixed(4);
        const width = rect.width.toFixed(4);
        const x = (rect.x + rect.width / 2).toFixed(4);
        const y = (rect.y + rect.height / 2).toFixed(4);
        if (imgMap[rect.imageId]) {
          imgMap[rect.imageId] += `${classNo} ${x} ${y} ${width} ${height}\n`;
        } else {
          imgMap[rect.imageId] = `${classNo} ${x} ${y} ${width} ${height}\n`;
        }
      } else {
        if (imgMap[rect.imageId]) {
          imgMap[rect.imageId] += `${classNo}`;
          rect.points.map((point) => {
            point = Number(point).toFixed(4);
            imgMap[rect.imageId] += ` ${point}`;
          });
          imgMap[rect.imageId] += '\n';
        } else {
          imgMap[rect.imageId] = `${classNo}`;
          rect.points.map((point) => {
            point = Number(point).toFixed(4);
            imgMap[rect.imageId] += ` ${point}`;
          });
          imgMap[rect.imageId] += '\n';
        }
      }
    });

    const formData = new FormData();
    const imageIds = [];
    images.forEach((img, index) => {
      if (imgMap[img.id]?.length || labelsEdited[img.id]) {
        const fileContents = imgMap[img.id] || '';
        console.log({ fileContents });
        const fileBlob = new Blob([fileContents], { type: 'text/plain' });
        formData.append('files', fileBlob, img.id);
        imageIds.push(img.id || '');
      }
    });

    formData.append('configurationId', configurationId);
    formData.append('imageIds', imageIds);

    if (!imageIds.length) {
      toast.success('No changes to update');
      return true;
    }

    if (isEditing) {
      toast(
        'Please confirm the creation of the new label first before proceeding',
        {
          icon: '⚠️',
        }
      );
      return;
    }
    try {
      const data = await axiosInstance.post(
        '/configuration/upload-label-files',
        formData
      );
      toast.success('Labels updated');
      setLabelsEdited({});
      // setIsEditing(false)
      submit();
      setInitialLabels(annotationRects);
      return data.data?.success;
    } catch (e) {
      toast.error(
        e?.response?.data?.data?.message
          ? `${e?.response?.data?.data?.message}. All fields are required`
          : 'Failed'
      );
    }
  };

  const fetchProject = async () => {
    try {
      const res = await axiosInstance.get('/project', {
        params: {
          projectId: projectId,
        },
      });
      setInspectionReq(res?.data?.data?.inspectionType);
    } catch (error) {
      toast.error(
        error?.response?.data?.data?.message || 'Cannot fetch project details'
      );
    }
  };

  const nextRef = useRef();

  const handleNext = async () => {
    if (isEditing) {
      toast(
        'Please confirm the creation of the new label/ROI first before proceeding',
        {
          icon: '⚠️',
        }
      );
      return;
    }

    let t = step;
    if (!canGoNext) t = 0;
    else if (t == 0) {
      const next = await getRois();
      t++;
    } else if (t == 1) {
      if (nextRef.current) {
        const res = await nextRef.current.handleSubmit();
        if (res) return;
      }
      t = (await prepareApiData()) ? t + 1 : t;
    } else if (t == 2) {
      t = (await updateAnnotation()) ? t + 1 : t;
    } else if (t == 3) {
      navigate(-1);
    } else if (t != 3) t += 1;
    setStep(t);
  };

  const handlePrev = () => {
    if (isEditing) {
      toast(
        'Please confirm the creation of the new label/ROI first before proceeding',
        {
          icon: '⚠️',
        }
      );
      return;
    }
    setSelectedImage(cachedImages[0]?.url ? cachedImages[0] : images[0]);
    if (step === 2) {
      reloadRois();
    }
    setStep((t) => {
      if (t == 0) return t;
      return t - 1;
    });
  };

  const calcHeight = () => {
    return (window.innerHeight * 11) / 12 - 154;
  };

  const cancel = () => {
    // setPolygons((polys) => polys.filter((poly) => poly.roiId !== currentRoiId));
    setImageStatus((prev) => ({
      ...prev,
      drawMode: false,
    }));
    setEditingRect(false);
    setIsEditing(false);
    setLabelId(null);
    setCurrentRoiId(null);
    setRectangleType(RECTANGLE_TYPE.ROI);
    setPolygonType(RECTANGLE_TYPE.ROI);
    setLastAction(ACTION_NAMES.CANCEL);
    setConfiguration((t) => ({
      ...t,
      rois: t.rois.map((k) => ({
        ...k,
        // status: k.id == currentRoiId ? STATUS.DEFAULT : k.status,
        status: k.id == currentRoiId ? prevStatus : k.status,
      })),
    }));
    setLabelClass((prev) => {
      return {
        ...prev,
        status: prevStatus,
      };
    });
    if (selectedRectId === 'capture-coordinate') {
      setCapturePosition(configuration.coordinate);
    }
    setSelectedRectId(null);
    setSelectedPolyId(null);
  };

  const submit = () => {
    setImageStatus((prev) => ({
      ...prev,
      drawMode: false,
    }));
    setLabelId(null);
    setEditingRect(false);
    setIsEditing(false);
    setCurrentRoiId(null);
    setSelectedRectId(null);
    setSelectedPolyId(null);
    setLastAction(ACTION_NAMES.SUBMIT);
    setConfiguration((t) => ({
      ...t,
      rois: t.rois.map((k) => ({
        ...k,
        // status: k.id == currentRoiId ? STATUS.FINISH : k.status,

        status:
          (k.id === currentRoiId &&
            (prevStatus === 'finish' ||
              rectangles.find((rect) => rect.title === k.title))) ||
          polygons.find((poly) => poly.title === k.title)
            ? STATUS.FINISH
            : k.id === currentRoiId
              ? STATUS.DEFAULT
              : k.status,
      })),
    }));
    setLabelClass((prev) => {
      if (!prev?.id) return null;
      return {
        ...prev,
        status: STATUS.FINISH,
      };
    });
    setRectangleType(RECTANGLE_TYPE.ROI);
    setPolygonType(RECTANGLE_TYPE.ROI);
  };

  const stepObj = {
    0: <UploadImagesStep />,
    1: <InspectionParameterStep type={type} nextRef={nextRef} />,
    2: <LabelImage type={type} save={updateAnnotation} />,
    3: <PreTrainingStep />,
  };

  const getRois = async () => {
    if (roisLoaded) return true;
    try {
      setNextLoader(true);
      const roiData = await axiosInstance.get('/configuration/classes', {
        params: {
          configurationId,
        },
      });
      let data = roiData.data?.data?.data;
      data = data?.sort((a, b) => a.rois.name.localeCompare(b.rois.name));
      data = structuredClone(data);
      if (data?.length) {
        const temp = [...data];
        temp.length &&
          temp.map((item, index) => {
            setConfiguration((prev) => ({
              ...prev,
              productFlow: item.configuration.direction,
            }));
            if (item.parts.isTracker) {
              setConfiguration((prev) => ({
                ...prev,
                primaryObject: item.parts.name,
                primaryObjectClass: item.parts.classId,
                direction: item.configuration.direction,
                coordinate:
                  item?.configuration?.coordinate !== null
                    ? Number(item?.configuration?.coordinate)
                    : null,
              }));
              setPosition(
                item?.configuration?.coordinate !== null
                  ? Number(item?.configuration?.coordinate)
                  : null
              );
              // data[index] = {
              //   ...data[index],
              //   parts: {}
              // }
            }
          });
        const partsMap = {};
        const roiMap = {};
        const rects = [];
        const polys = [];
        // let configUpdate = { productFlow: data[0].configuration.direction },
        //   configUpdateRequired = false;
        const img = new window.Image();
        img.crossOrigin = 'Anonymous';
        img.src = selectedImage.url;
        const avgBrightness = await new Promise((resolve, reject) => {
          img.onload = () => {
            try {
              resolve(getAverageBrightness(img));
            } catch (err) {
              toast.error('Error loading image');
              reject(err);
            }
          };
          img.onerror = (err) => {
            toast.error('Error loading image');
            reject(err);
          };
        });
        setImageBrightness(avgBrightness);
        data?.forEach((conf, i) => {
          const roiId = conf.rois.id;
          if (!roiMap[roiId]) {
            roiMap[roiId] = {
              id: i,
              title: conf.rois.name,
              identity: roiId,
              checked: false,
              status: STATUS.FINISH,
              open: true,
              parts: [],
            };
            //!do rectangle here too
            // const [ x1, y1, x2, y2] = conf.rois.coordinates.length > 4 ? ;
            const points = conf.rois.coordinates;
            const color = getRandomHexColor(avgBrightness);
            const uuid = v4();

            if (points.length === 4) {
              // it is rectangle
              const [x1, y1, x2, y2] = points;
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
            } else {
              //  it is polygon
              polys.push({
                ...BASE_RECT,
                id: rois.length + i,
                fill: color,
                stroke: color,
                imageId: images[0].id,
                polyType: RECTANGLE_TYPE.ROI,
                roiId: i,
                title: conf.rois.name,
                points: points,
                uuid,
                closed: true,
              });
            }
          }
          if (!partsMap[roiId]) {
            partsMap[roiId] = [];
          }
          // if (conf.parts.isTracker) {
          //   configUpdateRequired = true;
          //   configUpdate = {
          //     ...configUpdate,
          //     primaryObject: conf.parts?.name || '',
          //     primaryObjectClass: conf.parts?.name || '',
          //   };
          // }
          if (!conf?.parts?.isTracker) {
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
          }
        });
        for (let roiId in roiMap) {
          roiMap[roiId].parts = partsMap[roiId];
        }

        // const sortedKeys = Object.keys(roiMap).sort((a, b) =>
        //   roiMap[a].title.localeCompare(roiMap[b].title)
        // );

        // // Use the sorted keys to create the final sorted rois array
        // const sortedRois = sortedKeys.map((key) => roiMap[key]);

        setConfiguration((t) => ({
          ...t,
          rois: Object.values(roiMap),
          primaryObject: roiData?.data?.data?.primaryClass?.name,
          primaryObjectClass: roiData?.data?.data?.primaryClass?.id,
          // rois: sortedRois
        }));
        setRectangles((prev) => [...prev, ...rects]);
        setPolygons((prev) => [...prev, ...polys]);

        // if (configUpdateRequired) {
        //   setConfiguration((prev) => ({
        //     ...prev,
        //     ...configUpdate,
        //   }));
        // }
      } else if (type === ASSEMBLY_CONFIG.MOVING) {
        setConfiguration((prev) => ({
          ...prev,
          rois: [DEFAULT_ROI],
        }));
      }
      setNextLoader(false);
      setStep(1);
      return true;
    } catch (e) {
      toast.error(e.message || e?.response?.data?.data?.message);
      setNextLoader(false);
      return false;
    } finally {
      setRoisLoaded(true);
      setNextLoader(false);
    }
  };

  const reloadRois = async () => {
    try {
      setReloadRoisLoader(true);
      const roiData = await axiosInstance.get('/configuration/classes', {
        params: {
          configurationId,
        },
      });
      let data = roiData.data?.data?.data;
      data = data?.sort((a, b) => a.rois.name.localeCompare(b.rois.name));

      let roiMap = {};
      let partsMap = {};

      data?.forEach((conf, i) => {
        const roiId = conf.rois.id;
        if (!roiMap[roiId]) {
          roiMap[roiId] = {
            id: i,
            title: conf.rois.name,
            identity: roiId,
            checked: false,
            status: STATUS.FINISH,
            open: true,
            parts: [],
          };
        }
        if (!partsMap[roiId]) {
          partsMap[roiId] = [];
        }
        if (!conf?.parts?.isTracker) {
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
        }
      });
      for (let roiId in roiMap) {
        roiMap[roiId].parts = partsMap[roiId];
      }

      setConfiguration((t) => ({
        ...t,
        rois: Object.values(roiMap),
      }));
    } catch (error) {
      toast.error(error.message || error?.response?.data?.data?.message);
    } finally {
      setReloadRoisLoader(false);
    }
  };

  useEffect(() => {
    setLabelsEdited({});
    setLabelId(null);
    getProject();
    setIsEditing(false);
    fetchProject();

    return () => {
      uploadedFileList.forEach((value) => {
        URL.revokeObjectURL(value.url);
      });
      setUploadedFileList([]);
      setRectangleColor({
        all: [],
        selectedColor: getRandomHexColor(),
      });
      setImageBrightness(null);
      setPosition(null);
    };
  }, []);

  const prepareApiData = async () => {
    const imgMap = {};
    let temp = cloneDeep(configuration);
    // const temp = configuration;
    temp = {
      ...temp,
      coordinate: type === ASSEMBLY_CONFIG.MOVING ? position : undefined,
    };
    temp.direction = parseInt(temp.productFlow);
    temp.id = configurationId;
    delete temp.productFlow;
    temp.rois = configuration.rois.map((roi, index) => {
      const tempParts = roi.parts.map((part) => {
        return {
          classify: part.classify == 'on',
          class: part.class,
          name: part.objectName,
          count: part.qty,
          operator: part.operation,
        };
      });
      const points = [];
      rois.forEach((roiRect) => {
        if (roi.id == roiRect.roiId) {
          if (roiRect?.points) {
            if (roiRect.points.length) points.push(...roiRect.points);
          } else {
            points.push(parseFloat(roiRect.x.toFixed(4)));
            points.push(parseFloat(roiRect.y.toFixed(4)));
            points.push(parseFloat((roiRect.x + roiRect.width).toFixed(4)));
            points.push(parseFloat((roiRect.y + roiRect.height).toFixed(4)));
          }
        }
      });
      const isPrimary = roi?.primaryObject !== null;
      return {
        id: roi?.identity || '',
        name: roi?.title ?? `ROI ${roi?.id}`,
        // name: `ROI ${roi?.id}`,
        coordinates: points,
        parts: tempParts,
      };
    });
    let isValidRoi = true;
    temp?.rois?.forEach((roi) => {
      isValidRoi = roi?.parts?.length > 0;
    });
    if (!isValidRoi && type === ASSEMBLY_CONFIG.STATIONARY) {
      setError('There should be at least one object in each ROI');
      // setOpenModal(true);
      return;
    }
    // if (temp.direction != 0) {
    //   temp.rois[0].primaryObject = null;
    // }
    delete temp.primaryObject;
    delete temp.primaryObjectClass;
    if (type === ASSEMBLY_CONFIG.MOVING) {
      temp.primaryClass = {
        id: configuration.primaryObjectClass,
        name: configuration.primaryObject,
      };
    }
    const formData = new FormData();
    // await Promise.all(images.map(async(img, index)=>{
    //   const resp = await fetch(img.url)
    //   const blob = await resp.blob()
    //   formData.append('images', blob, img.name)
    // }))
    formData.append('data', JSON.stringify(temp));
    // formData.append('configurationId', configurationId);
    // formData.append(
    //   'isGood',
    //   JSON.stringify([
    //     true,
    //     true,
    //     true,
    //     true,
    //     true,
    //     false,
    //     false,
    //     false,
    //     false,
    //     false,
    //   ])
    // );
    try {
      const data = await axiosInstance.post('/configuration/assembly', temp);
      toast.success('ROIs uploaded');
      return data.data?.success;
    } catch (e) {
      toast.error(
        e?.response?.data?.data?.details?.message ||
          e?.response?.data?.data?.message ||
          'All ROIs label are required!'
      );
    }
  };

  let imageIdStore = new Set();
  rectangles.forEach((rect) => {
    rect.imageId &&
      rect.rectType == RECTANGLE_TYPE.ANNOTATION_LABEL &&
      imageIdStore.add(rect.imageId);
  });
  polygons.forEach((poly) => {
    poly.imageId &&
      poly.polyType == RECTANGLE_TYPE.ANNOTATION_LABEL &&
      imageIdStore.add(poly.imageId);
  });
  const isAllImagesLabeled = imageIdStore.size == 10;

  return (
    <>
      <div className="grid h-screen grid-cols-12 ">
        {reloadRoisLoader && <ProjectCreateLoader title="Loading ROIs" />}
        {error && (
          <LocalModal isOpen={error} onClose={() => setError('')} isHalf={true}>
            <ErrorModal error={error} setOpenModal={() => setError('')} />
          </LocalModal>
        )}
        <div
          className={`${step === 3 ? 'col-span-12 px-10' : 'col-span-5'} grid grid-rows-12 border-r-[1px] border-gray-400 bg-white`}
          style={{ maxHeight: '100vh', overflow: 'hidden' }}
        >
          <div
            className={`row-span-11 flex flex-col ${step === 3 ? 'mx-auto my-2 w-[85%]' : ''}`}
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
              <Button
                size="xs"
                onClick={() => {
                  if (step == 2) {
                    isAllImagesLabeled && handleNext();
                  } else {
                    handleNext();
                  }
                }}
                disabled={!canGoNext || nextLoader}
                className={
                  !isAllImagesLabeled && step == 2
                    ? 'cursor-not-allowed bg-slate-400 hover:bg-slate-400'
                    : ''
                }
              >
                {nextLoader ? 'Loading...' : step == 3 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
        </div>

        {step !== 3 && (
          <div className="col-span-7 grid grid-rows-12">
            <div
              className="row-span-11 flex flex-col items-center justify-center gap-4 bg-[#EAEDF1]"
              style={{ overflow: 'hidden' }}
            >
              <UploadImage type={type} />
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
