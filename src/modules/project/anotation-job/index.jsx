import AnnotationClass from './AnnotationClass';

import Button from '@/shared/ui/Button';
import Pagination from '@/shared/ui/Pagination';
import AnnotationImage from './AnnotationImage';
import AnnotationLabels from './AnnotationLabels';
import Actions from '../assembly/components/Actions';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  initialLabelsAtom,
  rectangleColorAtom,
  stepAtom,
} from '../assembly/state';
import React, { useEffect, useRef, useState } from 'react';
import KonvaImageView from '../assembly/components/KonvaImageView';
import axiosInstance from '@/core/request/aixosinstance';
import { useNavigate, useParams } from 'react-router-dom';
import useImage from 'use-image';
import {
  annotationCacheAtom,
  annotationClassesAtom,
  annotationMapAtom,
  assemblyAtom,
  cacheLoaderAtom,
  currentLabelIdAtom,
  currentRectangleIdAtom,
  editingAtom,
  labelClassAtom,
  labelEditedAtom,
  lastActionNameAtom,
  rectanglesAtom,
  polygonsAtom,
  selectedFileAtom,
  uploadedFileListAtom,
  currentPolygonIdAtom,
  imageStatusAtom,
} from '../state';
import { compareArrays, getRandomHexColor } from '@/util/util';
import {
  ACTION_NAMES,
  ASSEMBLY_CONFIG,
  BASE_RECT,
  DEFAULT_ANNOTATION,
  RECTANGLE_TYPE,
} from '@/core/constants';
import toast from 'react-hot-toast';
import { v4 } from 'uuid';
import Modal, { ModalBody, ModalFooter, ModalHeader } from '@/shared/ui/Modal';
import { modalAtom } from '@/shared/states/modal.state';

export default function AnnotationJob() {
  const { datasetId, projectId, configurationId } = useParams();
  const [step, setStep] = useRecoilState(stepAtom);
  const [images, setAllImages] = useRecoilState(uploadedFileListAtom);
  const [file, setFile] = useState(null);
  // const setIsEditing = useSetRecoilState(editingAtom);
  const [isEditing, setIsEditing] = useRecoilState(editingAtom);
  const [rectangles, setRectangles] = useRecoilState(rectanglesAtom);
  const [polygons, setPolygons] = useRecoilState(polygonsAtom);
  const [labelClass, setLabelClass] = React.useState([]);
  const [selectedImage, setSelectedImage] = useRecoilState(selectedFileAtom);
  const selectedClass = useRecoilValue(labelClassAtom);
  const setLastAction = useSetRecoilState(lastActionNameAtom);
  const [annotatedCount, setAnnotatedCount] = useState(0);
  const [annotationLoadeFlag, setAnnotationLoadedFlag] = useState({});
  const [annotationMap, setAnnotationMap] = useRecoilState(annotationMapAtom);
  const loaders = useRecoilValue(cacheLoaderAtom);
  const [cachedImages, setCachedImages] = useRecoilState(annotationCacheAtom);
  const labelRef = React.useRef(labelClass);
  const [rois, setRois] = React.useState([]);
  const nav = useNavigate();
  const [annotationClasses, setAnnotationClasses] = useRecoilState(
    annotationClassesAtom
  );
  const selectedClassId = useRecoilValue(labelClassAtom);
  const setSelectedRectId = useSetRecoilState(currentRectangleIdAtom);
  const setSelectedPolyId = useSetRecoilState(currentPolygonIdAtom);
  const [modalOpen, setModalOpen] = useRecoilState(modalAtom);
  const [type, setType] = useState(ASSEMBLY_CONFIG.STATIONARY);

  // const [primaryClass, setPrimaryClass] = useState(null);

  const cacheRef = useRef(null);

  const [rectangleColor, setRectangleColor] =
    useRecoilState(rectangleColorAtom);

  const [labelsEdited, setLabelsEdited] = useRecoilState(labelEditedAtom);
  const [labelId, setLabelId] = useRecoilState(currentLabelIdAtom);

  const [imageStatus, setImageStatus] = useRecoilState(imageStatusAtom);
  const [polyDraw, setPolyDraw] = useState(false);

  const [initialLabels, setInitialLabels] = useRecoilState(initialLabelsAtom);
  const [primaryClass, setPrimaryClass] = useState(null);

  const getImageUrl = (id) => {
    return `${import.meta.env.VITE_BASE_API_URL}/dataset/image?imageId=${id}`;
  };
  const [image] = useImage(file);

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

  const getAllImages = async () => {
    setFile(null);
    setRectangles([]);
    setPolygons([]);
    try {
      const allImages = await axiosInstance.get('/dataset/allImages', {
        params: {
          folderId: datasetId,
        },
      });
      const mapObj = {};
      const loadedImages = allImages.data.data.map((ele) => {
        mapObj[ele.id] = false;
        return { ...ele, url: getImageUrl(ele.id) };
      });
      setAllImages(loadedImages);
      setAnnotationLoadedFlag(mapObj);
    } catch (e) {
      setAllImages([]);
    }
  };

  const getUniqueHexColor = (colors) => {
    let hexColor;
    do {
      hexColor = getRandomHexColor();
    } while (colors.map((col) => col.color).includes(hexColor));
    return hexColor;
  };

  const getClasses = async () => {
    try {
      const classes = await axiosInstance.get('/class/list', {
        params: {
          projectId,
        },
      });
      // const color = getRandomHexColor();
      const colors = [];
      setLabelClass(
        classes.data.data.map((cls) => {
          // const findColor = rectangleColor.all.find(
          //   (obj) => obj.name === key
          // )?.color;
          // console.log({ findColor });
          // const color = findColor ? findColor : getUniqueHexColor(colors);
          const color = getUniqueHexColor(colors);
          console.log({ cls });
          colors.push({
            ...cls,
            color: color,
          });
          return { ...cls, color: color };
        })
      );
      
      getRois();
      // setRectangleColor((prev) => ({
      //   ...prev,
      //   all: prev.all.length === colors.length ? [...prev.all] : colors,
      // }));
      if (colors.length > 0)
        setRectangleColor((prev) => ({ ...prev, all: colors }));
    } catch (error) {}
  };

  const cancel = () => {
    setImageStatus((prev) => ({
      ...prev,
      drawMode: false,
    }));
    setIsEditing(false);
    setLabelId(null);
    setLastAction(ACTION_NAMES.CANCEL);
  };

  const submit = () => {
    setImageStatus((prev) => ({
      ...prev,
      drawMode: false,
    }));
    setIsEditing(false);
    setLabelId(null);
    setLastAction(ACTION_NAMES.SUBMIT);
  };

  // const preUpdate = () => {
  //   return new Promise((res, rej)=>{
  //     const image = new Image();
  //     image.src = images[0].url
  //     image.onload = ()=>updateAnnotation(image).then(success=>{
  //       if(success) res(true);
  //       else res(false);
  //     }).catch(()=>res(false));
  //   })
  // }

  console.log({ initialLabels }, { annotationClasses });

  const handleExit = () => {
    if (isEditing) {
      toast(
        'Please confirm the creation of the new label first before proceeding',
        {
          icon: '⚠️',
        }
      );
      return;
    }
    const changedList = Object.values(annotationClasses).filter(
      (cls) => cls.changed
    );

    const imageSpecificRects = changedList.reduce((prev, cur) => {
      return [...prev, ...cur.rectangles, ...cur.polygons];
    }, []);

    const cls = [
      ...(annotationClasses[selectedImage.id].rectangles || []),
      ...(annotationClasses[selectedImage.id].polygons || []),
    ];

    if (
      initialLabels[selectedImage.id]?.length === cls.length &&
      !compareArrays(imageSpecificRects, initialLabels[selectedImage.id])
    ) {
      setModalOpen(false);
      nav('..', { relative: 'route' });
    } else {
      setModalOpen(true);
    }
    console.log({ modalOpen });
  };

  const updateAnnotation = async () => {
    if (isEditing) {
      toast(
        'Please confirm the creation of the new label first before proceeding',
        {
          icon: '⚠️',
        }
      );
      return;
    }
    const imgMap = {};
    const changedList = Object.values(annotationClasses).filter(
      (cls) => cls.changed
    );
    // if (changedList.length == 0) return false;

    const imageSpecificRects = changedList.reduce((prev, cur) => {
      return [...prev, ...(cur.rectangles || []), ...(cur.polygons || [])];
    }, []);
    
    const cls = [
      ...(annotationClasses[selectedImage.id].rectangles || []),
      ...(annotationClasses[selectedImage.id].polygons || []),
    ];

    if (
      initialLabels[selectedImage.id]?.length === cls.length &&
      !compareArrays(cls, initialLabels[selectedImage.id])
    ) {
      toast.success('No changes to update');
      setModalOpen(false);
      return true;
    }
    // if (imageSpecificRects.length == 0) return false;
    const imageIds = [];
    imageSpecificRects.forEach((rect) => {
      // console.log(annotationMap, rect.uuid);
      // if (!imageIds.includes(rect.imageId)) imageIds.push(rect.imageId);
      const classNo = annotationMap[rect.uuid];
      if (rect?.x) {
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
          console.log('old', imgMap[rect.imageId]);
        } else {
          imgMap[rect.imageId] = `${classNo}`;
          rect.points.map((point) => {
            console.log('point11', point);
            point = Number(point).toFixed(4);
            imgMap[rect.imageId] += ` ${point}`;
          });
          imgMap[rect.imageId] += '\n';
        }
      }
    });

    const formData = new FormData();
    changedList.forEach((item) => {
      const id = item.imageId;
      console.log(id);
      const fileContents = imgMap[id] || '';
      console.log({ fileContents });
      const fileBlob = new Blob([fileContents], { type: 'text/plain' });
      formData.append('files', fileBlob, id);
      imageIds.push(id);
    });

    formData.append('datasetImageId', imageIds);
    formData.append('configurationId', configurationId);

    if (!imageIds.length) {
      toast.success('No changes1 to update');
      setModalOpen(false);
      return true;
    }

    try {
      const data = await axiosInstance.post('/annotation', formData);
      toast.success('Labels updated');
      setModalOpen(false);
      const updates = {};
      imageIds.forEach((imgId) => {
        updates[imgId] = { ...annotationClasses[imgId], changed: false };
      });
      setAnnotationClasses((prev) => ({ ...prev, ...updates }));
      setInitialLabels((prev) => ({
        ...prev,
        [selectedImage.id]: imageSpecificRects,
      }));
      return data.data?.success;
    } catch (e) {
      toast.error(
        e?.response?.data?.data?.message
          ? `${e?.response?.data?.data?.message}. All fields are required`
          : 'Failed'
      );
    }
    return false;
  };

  React.useEffect(() => {
    labelRef.current = labelClass;
  }, [labelClass]);

  const getRois = async () => {
    try {
      const roiData = await axiosInstance.get('/configuration/classes', {
        params: {
          configurationId,
        },
      });
      const data = roiData.data?.data?.data;
      const primaryClassObj = roiData?.data?.data?.primaryClass;
      setPrimaryClass(primaryClassObj);
      console.log('configuration/class', { data });
      if (data.length) {
        const rects = [];
        const roiMap = {};
        const classesSet = new Set();
        data?.forEach((conf, i) => {
          const roiId = conf.rois.id;
          if (!roiMap[roiId]) {
            if (conf.rois.coordinates.length === 4) {
              const [x1, y1, x2, y2] = conf.rois.coordinates;
              const color = getRandomHexColor();
              rects.push({
                ...BASE_RECT,
                id: i,
                fill: color,
                stroke: color,
                imageId: null,
                rectType: RECTANGLE_TYPE.ROI,
                roiId: i,
                // title: `ROI ${i}`,
                title: conf.rois.name,
                x: parseFloat(x1),
                y: parseFloat(y1),
                width: parseFloat(x2 - x1),
                height: parseFloat(y2 - y1),
                uuid: v4(),
              });
            } else {
              const color = getRandomHexColor();
              rects.push({
                ...BASE_RECT,
                id: i,
                fill: color,
                stroke: color,
                imageId: null,
                polyType: RECTANGLE_TYPE.ROI,
                roiId: i,
                title: conf.rois.name,
                points: conf.rois.coordinates,
                uuid: v4(),
                closed: true
              });
            }
          }
          roiMap[roiId] = true;
          classesSet.add(conf.parts.classId);
        });
        if(primaryClassObj?.id)classesSet.add(primaryClassObj?.id)
        setLabelClass((prev) =>
          prev.filter((cls) => {
            return classesSet.has(cls.id);
          })
        );
        if (rects.length) setRois(rects);
      }
      return true;
    } catch (e) {
      return false;
    }
  };

  React.useEffect(() => {
    setIsEditing(false);
    setLabelId(null);
    setInitialLabels([]);
    setAnnotationClasses({});
    setStep(2);
    setRectangles([]);
    setPolygons([]);
    getAllImages();
    getClasses();
    getProject();

    return () => setModalOpen(false);
  }, []);

  React.useEffect(() => {
    console.log('Images triggered');
    if (images?.length) {
      setSelectedImage(images[0]);
    }
  }, [images]);

  React.useEffect(() => {
    if (selectedImage) {
      setFile(selectedImage.url);
    }
  }, [selectedImage]);

  React.useEffect(() => {
    const imageSet = new Set();
    rectangles.forEach(
      (rect) =>
        rect.rectType == RECTANGLE_TYPE.ANNOTATION_LABEL &&
        imageSet.add(rect.imageId)
    );
    polygons.forEach(
      (poly) =>
        poly.polyType == RECTANGLE_TYPE.ANNOTATION_LABEL &&
        imageSet.add(poly.imageId)
    );
    images.forEach((img) => img.annotated && imageSet.add(img.id));
    setAnnotatedCount(imageSet.size);
  }, [rectangles, polygons, images]);

  //load annotation file and load rectangles
  React.useEffect(() => {
    console.log('check', annotationLoadeFlag[selectedImage?.id], selectedImage, rectangleColor.all.length)
    if (
      selectedImage &&
      !annotationLoadeFlag[selectedImage.id] &&
      rectangleColor.all.length
    ) {
      const getData = async () => {
        console.log(`getting ${selectedImage?.id}`)
        const newStat = {
          ...DEFAULT_ANNOTATION,
          imageId: selectedImage.id,
        };
        try {
          const data = await axiosInstance.get('/annotation', {
            params: {
              configurationId,
              datasetImageId: selectedImage.id,
            },
          });
          const prevData = data?.data;
          if (prevData.length && typeof prevData == 'string') {
            const configuredData = [];
            const annotUpdates = {};
            prevData.split('\n').forEach((entry, i) => {
              const line = entry.split(' ');
              if (line.length >= 5) {
                // let [cls, x, y, width, height] = line;
                let [cls, ...vals] = line;

                const className = labelRef.current?.find(
                  (ele) => ele.id == cls
                )?.name;
                console.log({ className });

                // const color = getRandomHexColor();
                const color = rectangleColor.all.find(
                  (obj) => obj.name === className
                );
                // const color = "#e02113";

                const id = selectedImage.id;
                const uuid = v4();

                if (vals.length === 4) {
                  let [x, y, width, height] = vals;
                  configuredData.push({
                    ...BASE_RECT,
                    id: rectangles.length + i,
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
                } else {
                  configuredData.push({
                    ...BASE_RECT,
                    id: polygons.length + i,
                    fill: color?.color,
                    stroke: color?.color,
                    imageId: id,
                    polyType: RECTANGLE_TYPE.ANNOTATION_LABEL,
                    // roiId: roi.id,
                    title: className,
                    // points: vals.map((point) => parseFloat(point)),
                    points: vals,
                    uuid,
                    closed: true,
                  });
                }

                annotUpdates[uuid] = cls;
              }
            });
            // console.log('UPdate from txt', annotUpdates, configuredData);
            setAnnotationMap((prev) => ({ ...prev, ...annotUpdates }));
            // setRectangles(prev=>[...prev, ...configuredData]);
            // newStat.rectangles = configuredData;
            const recs = [];
            const polys = [];
            configuredData.map((conf, i) => {
              if (conf?.x) {
                recs.push(conf);
              } else {
                polys.push(conf);
              }
            });
            newStat.rectangles = recs;
            newStat.polygons = polys;

            console.log({ newStat });
            setInitialLabels((prev) => ({
              ...prev,
              [selectedImage.id]: configuredData,
            }));
          } else {
            setInitialLabels((prev) => ({ ...prev, [selectedImage.id]: [] }));
          }

          // if (!(prevData.length && typeof prevData == 'string')) {
          //   console.log('empty');
          //   setInitialLabels((prev) => ({ ...prev, [selectedImage.id]: [] }));
          // }

          setAnnotationLoadedFlag((prev) => {
            return { ...prev, [selectedImage.id]: true };
          });
        } catch (e) {
          setInitialLabels((prev) => ({ ...prev, [selectedImage.id]: [] }));
        } finally {
          setAnnotationClasses((prev) => ({
            ...prev,
            [selectedImage.id]: newStat,
          }));
        }
      };
      getData();

      setAnnotationLoadedFlag((prev) => ({
        ...prev,
        [selectedImage.id]: true,
      }));
    }
  }, [selectedImage, rectangleColor]);

  console.log(rectangles);

  const udpateAndExit = async () => {
    await updateAnnotation();
    setModalOpen(false);
    nav('..', { relative: 'route' });
  };

  React.useEffect(() => {
    if (selectedImage?.id) {
      setRectangles(annotationClasses[selectedImage.id]?.rectangles || []);
      setPolygons(annotationClasses[selectedImage.id]?.polygons || []);
      // console.log("new rectangle", annotationClasses[selectedImage.id]?.rectangles[rectangles.length])
      setLabelId(
        annotationClasses[selectedImage.id]?.rectangles[rectangles.length]?.uuid
      );
    }
  }, [annotationClasses, selectedImage]);

  React.useEffect(() => {
    // setIsEditing(false);
    return () => {
      cacheRef.current.forEach((value, key) => {
        URL.revokeObjectURL(value.url);
      });
      setCachedImages(new Map());
      setRectangleColor({
        all: [],
        selectedColor: getRandomHexColor(),
      });
    };
  }, []);

  React.useEffect(() => {
    if (selectedImage?.id) {
      setRectangles(annotationClasses[selectedImage.id]?.rectangles || []);
      setPolygons(annotationClasses[selectedImage.id]?.polygons || []);
    }
  }, [annotationClasses, selectedImage]);

  React.useEffect(() => {
    cacheRef.current = cachedImages;
  }, [cachedImages]);

  console.log(
    'outside',
    { modalOpen },
    annotationClasses[selectedImage?.id]?.rectangles
  );

  useEffect(() => {
    if (imageStatus.drawMode === 'POLY') {
      setPolyDraw(true);
    } else if (imageStatus.drawMode == false) {
      setPolyDraw(false);
    }
  }, [imageStatus.drawMode]);

  const renderAnnotationHeading = () => {
    if(type === ASSEMBLY_CONFIG.MOVING){
      return <div className="flex flex-col gap-4 p-4">
        <AnnotationClass labelClass={labelClass.filter(lc => lc.id === primaryClass?.id)} isPrimary={true} />
        <AnnotationLabels
          labelClass={labelClass.filter(lc => lc.id === primaryClass?.id)}
          selectedImageId={selectedImage?.id}
          isPrimary={true}
        />
      </div>
    }
    return <></>
  }

  return (
    <>
      {modalOpen && (
        <Modal>
          <ModalHeader>You have unsaved changes</ModalHeader>
          <ModalBody>
            You have unsaved local changes. The data will be lost if not saved.
            Do you want to exit?
          </ModalBody>
          <ModalFooter>
            <div className="flex flex-row justify-end gap-4">
              <Button
                size="sm"
                color="success"
                fullWidth={false}
                onClick={udpateAndExit}
              >
                Save and exit
              </Button>
              <Button
                size="sm"
                color="danger"
                fullWidth={false}
                onClick={() => {
                  setModalOpen(false);
                  nav('..', { relative: 'route' });
                }}
              >
                Discard and exit
              </Button>
            </div>
          </ModalFooter>
        </Modal>
      )}
      <div className="grid h-screen grid-cols-12">
        <div className="col-span-3 grid grid-rows-12 border-r-[1px] border-black">
          <div className="row-span-11  flex flex-col bg-white">
            <h1 className=" border-b-[1px] px-6 pb-6 pt-6 text-3xl font-bold">
              Annotation Job
            </h1>
            {renderAnnotationHeading()}
            <div className="flex grow flex-col gap-4 p-4">
              <AnnotationClass labelClass={labelClass.filter(lc => lc.id !== primaryClass?.id)} />
              <AnnotationLabels
                labelClass={labelClass.filter(lc => lc.id !== primaryClass?.id)}
                selectedImageId={selectedImage?.id}
              />
            </div>
            <div
              className="border-t-[1px] border-black  py-2"
              style={{ position: 'sticky' }}
            >
              <p className="text-center">
                {annotatedCount}/{images.length} Images Annotated
              </p>
              <Pagination />
            </div>
          </div>
          <div className="row-span-1 flex items-center gap-2 border-t-[1px] border-black bg-white px-6">
            <Button
              variant="flat"
              size="xs"
              //  onClick={() => setModalOpen(true)}
              onClick={handleExit}
            >
              Exit
            </Button>
            <Button size="xs" onClick={updateAnnotation}>
              Save
            </Button>
          </div>
        </div>
        <div className="col-span-9 grid grid-rows-12">
          <div className="row-span-11 flex flex-col items-center justify-center gap-4 bg-[#EAEDF1]">
            <div
              className="flex h-full w-full flex-col items-center justify-center gap-4"
              style={{
                width: ((window.innerWidth - 16 * 4) * 9) / 12,
                maxHeight: '91.65vh',
              }}
            >
              {loaders.get(selectedImage?.id) ? (
                <div className="flex h-full w-[30%] flex-col items-center justify-center gap-4">
                  <div className="text-xl font-medium">Loading Image</div>
                  <div className="loading px-4 text-center"></div>
                </div>
              ) : (
                <>
                  {file && image?.width && (
                    <KonvaImageView
                      onDrawStop={(rects) => {
                        console.log('rect updated');
                        const annots = rects.filter(
                          (rect) =>
                            rect.rectType == RECTANGLE_TYPE.ANNOTATION_LABEL
                        );
                        setAnnotationClasses((prev) => ({
                          ...prev,
                          [selectedImage.id]: {
                            ...prev[selectedImage.id],
                            rectangles: annots,
                            changed: true,
                          },
                        }));
                        let annotations = annots.filter(
                          (e) => annotationMap[e.uuid] == undefined
                        );
                        if (annotations.length) {
                          setAnnotationMap((prev) => {
                            const updates = {};
                            annotations.forEach((annot) => {
                              updates[annot.uuid] = selectedClassId.id;
                            });
                            return { ...prev, ...updates };
                          });
                          setSelectedRectId(annotations[0].uuid);
                        }
                      }}
                      rectangles={
                        annotationClasses[selectedImage?.id]
                          ? [
                              ...rois.filter((roi) => roi?.x),
                              ...annotationClasses[selectedImage?.id]
                                .rectangles,
                            ]
                          : rois
                      }
                      title={selectedClass?.name || 'Label'}
                      image={image}
                      imageId={selectedImage?.id}
                      polygons={
                        annotationClasses[selectedImage?.id]
                          ? [
                              ...rois.filter((roi) => roi?.points),
                              ...(annotationClasses[selectedImage?.id]
                                .polygons || []),
                            ]
                          : rois
                      }
                      onPolyUpdate={(polys) => {
                        console.log('poly updated');
                        const annots = polys.filter(
                          (poly) =>
                            poly.polyType == RECTANGLE_TYPE.ANNOTATION_LABEL
                        );
                        setAnnotationClasses((prev) => ({
                          ...prev,
                          [selectedImage.id]: {
                            ...prev[selectedImage.id],
                            polygons: [...annots],
                            changed: true,
                          },
                        }));
                        let annotations = annots.filter(
                          (e) => annotationMap[e.uuid] === undefined
                        );
                        if (annotations.length) {
                          setAnnotationMap((prev) => {
                            const updates = {};
                            annotations.forEach((annot) => {
                              updates[annot.uuid] = selectedClassId.id;
                            });
                            return { ...prev, ...updates };
                          });
                          setSelectedPolyId(annotations[0].uuid);
                        }
                      }}
                      polyDraw={polyDraw}
                    />
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between border-t-[1px] border-gray-400 bg-white">
            <Actions cancel={cancel} submit={submit} />
          </div>
        </div>
      </div>
    </>
  );
}
