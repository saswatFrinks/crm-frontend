import AnnotationClass from './AnnotationClass';

import Button from '@/shared/ui/Button';
import Pagination from '@/shared/ui/Pagination';
import AnnotationImage from './AnnotationImage';
import AnnotationLabels from './AnnotationLabels';
import Actions from '../assembly/components/Actions';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { stepAtom } from '../assembly/state';
import React, { useEffect, useState } from 'react'
import KonvaImageView from '../assembly/components/KonvaImageView';
import axiosInstance from '@/core/request/aixosinstance';
import { useNavigate, useParams } from 'react-router-dom';
import useImage from 'use-image';
import { annotationClassesAtom, annotationMapAtom, assemblyAtom, currentRectangleIdAtom, editingAtom, labelClassAtom, lastActionNameAtom, rectanglesAtom, selectedFileAtom, uploadedFileListAtom } from '../state';
import { getRandomHexColor } from '@/util/util';
import { ACTION_NAMES, BASE_RECT, DEFAULT_ANNOTATION, RECTANGLE_TYPE } from '@/core/constants';
import toast from 'react-hot-toast';
import { v4 } from 'uuid';

export default function AnnotationJob() {
  const {datasetId, projectId, configurationId} = useParams();
  const [step, setStep] = useRecoilState(stepAtom);
  const [images, setAllImages] = useRecoilState(uploadedFileListAtom);
  const [file, setFile] = useState(null);
  const setIsEditing = useSetRecoilState(editingAtom);
  const [rectangles, setRectangles] = useRecoilState(rectanglesAtom);
  const [labelClass, setLabelClass] = React.useState([])
  const [selectedImage, setSelectedImage] = useRecoilState(selectedFileAtom);
  const selectedClass = useRecoilValue(labelClassAtom);
  const setLastAction = useSetRecoilState(lastActionNameAtom);
  const [annotatedCount, setAnnotatedCount] = useState(0);
  const [annotationLoadeFlag, setAnnotationLoadedFlag] = useState({})
  const [annotationMap, setAnnotationMap] = useRecoilState(annotationMapAtom);
  const labelRef = React.useRef(labelClass);
  const [rois, setRois] = React.useState(false)
  const nav = useNavigate()
  const [annotationClasses, setAnnotationClasses] = useRecoilState(annotationClassesAtom)
  const selectedClassId = useRecoilValue(labelClassAtom)
  const setSelectedPloyId = useSetRecoilState(currentRectangleIdAtom)

  const getImageUrl = (id) => {
    return `${import.meta.env.VITE_BASE_API_URL}/dataset/image?imageId=${id}`
  }
  const [image] = useImage(file);

  const getAllImages = async() => {
    setFile(null);
    setRectangles([]);
    try{
      const allImages =await axiosInstance.get('/dataset/allImages', {
        params: {
          folderId: datasetId
        }
      })
      const mapObj = {}
      const loadedImages = allImages.data.data.map(ele=>{
        mapObj[ele.id] = false;
        return{...ele, url: getImageUrl(ele.id)}
      });
      console.log("loaded images", loadedImages);
      setAllImages(loadedImages);
      setAnnotationLoadedFlag(mapObj)
    }
    catch(e){
      setAllImages([]);
    }
  }

  const getClasses = async() => {
    try {
      const classes = await axiosInstance.get("/class/list", {
        params: {
          projectId
        }
      })
      setLabelClass(classes.data.data.map(cls=>({...cls, color: getRandomHexColor()})))
      getRois();
    } catch (error) {
      
    }
  }

  const cancel = () => {
    setIsEditing(false);
    setLastAction(ACTION_NAMES.CANCEL);
  };

  const submit = () => {
    setIsEditing(false);
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

  const updateAnnotation = async () => {
    const imgMap = {};
    const changedList = Object.values(annotationClasses).filter(cls=>cls.changed);
    const imageSpecificRects = changedList.reduce((prev, cur)=>{
      return [...prev, ...cur.rectangles]
    }, [])
    console.log(selectedImage, imageSpecificRects )
    if(imageSpecificRects.length==0) return false;
    const imageIds = []
    imageSpecificRects.forEach((rect)=>{
      console.log(annotationMap, rect.uuid);
      if(!imageIds.includes(rect.imageId)) imageIds.push(rect.imageId);
      const classNo = annotationMap[rect.uuid]
      const height = (rect.height).toFixed(4)
      const width = (rect.width).toFixed(4)
      const x = (rect.x+rect.width/2).toFixed(4)
      const y = (rect.y+rect.height/2).toFixed(4)
      if(imgMap[rect.imageId]){
        imgMap[rect.imageId]+= `${classNo} ${x} ${y} ${width} ${height}\n`
      }else{
        imgMap[rect.imageId] = `${classNo} ${x} ${y} ${width} ${height}\n`
      }
    })
    const formData = new FormData();
    imageIds.forEach(id=>{
      console.log(id)
      const fileContents = imgMap[id] || ""
      const fileBlob = new Blob([fileContents], { type: 'text/plain' })
      formData.append('files', fileBlob, id);
    })
    formData.append('datasetImageId', imageIds);
    formData.append('configurationId', configurationId);
    try{
      const data = await axiosInstance.post("/annotation", formData)
      toast.success("Labels uploaded")
      const updates ={};
      imageIds.forEach(imgId=>{
        updates[imgId] = {...annotationClasses[imgId], changed: false};
      })
      setAnnotationClasses(prev=>({...prev, ...updates}));
      return data.data?.success
    }
    catch(e){
      toast.error(e?.response?.data?.data?.message ? `${e?.response?.data?.data?.message}. All fields are required`: 'Failed')
    }
    return false;
  }

  React.useEffect(()=>{
    labelRef.current = labelClass;
  }, [labelClass])

  const getRois = async () => {
    try{
      const roiData = await axiosInstance.get('/configuration/classes', {
        params: {
          configurationId
        }
      })
      const data = JSON.parse(roiData.data.data?.data)
      if(data.length){
        const rects = []
        const roiMap = {}
        const classesSet = new Set();
        data?.forEach((conf, i)=>{
          const roiId = conf.rois.id;
          if(!roiMap[roiId]){
            const {x1, x2, y1, y2} = conf.rois;
            const color = getRandomHexColor();
            rects.push({
                ...BASE_RECT, 
                id:  i,
                fill: color,
                stroke: color,
                imageId: null,
                rectType: RECTANGLE_TYPE.ROI,
                roiId:i,
                title: `ROI_${i+1}`,
                x: parseFloat(x1),
                y: parseFloat(y1),
                width: parseFloat(x2-x1),
                height: parseFloat(y2-y1),
                uuid: v4()
            })
          }
          classesSet.add(conf.parts.classId);
        })
        setLabelClass(prev=>prev.filter(cls=>classesSet.has(cls.id)));
        if(rects.length)
          setRois(rects);
    }
      return true
    }
    catch(e){
      return false;
    }
  }

  React.useEffect(()=>{
    setStep(2);
    setRectangles([]);
    getAllImages();
    getClasses();
  }, [])

  React.useEffect(()=>{
    console.log('Images triggered');
    if(images?.length){
      setSelectedImage(images[0]);
    }
  }, [images]);

  React.useEffect(()=>{
    if(selectedImage){
      setFile(selectedImage.url)
    }
  }, [selectedImage])

  React.useEffect(()=>{
    const imageSet = new Set();
    rectangles.forEach(rect=>rect.rectType==RECTANGLE_TYPE.ANNOTATION_LABEL && imageSet.add(rect.imageId))
    images.forEach(img=>img.annotated && imageSet.add(img.id))
    setAnnotatedCount(imageSet.size);
  }, [rectangles, images]);

  //load annotation file and load rectangles
  React.useEffect(()=>{
    if(selectedImage && !annotationLoadeFlag[selectedImage.id]){
      const getData = async () => {
        const newStat = {
          ...DEFAULT_ANNOTATION,
          imageId: selectedImage.id
        };
        try{
          const data = await axiosInstance.get('/annotation', {
            params: {
              configurationId,
              datasetImageId: selectedImage.id
            }
          })
          const prevData = data?.data
          if(prevData.length && typeof prevData == 'string'){
              const configuredData = []
              const annotUpdates = {}
              prevData.split('\n').forEach((entry, i)=>{
                const line = entry.split(' ');
                if(line.length>=5){
                  let [cls, x, y, width, height] = line;
  
                  const className = labelRef.current?.find(ele=>ele.id==cls)?.name
                  console.log(cls,className)
  
                  const color = getRandomHexColor();
                  const id = selectedImage.id;
                  const uuid = v4();
                  configuredData.push({
                    ...BASE_RECT, 
                    id: rectangles.length + i,
                    fill: color,
                    stroke: color,
                    imageId: id,
                    rectType: RECTANGLE_TYPE.ANNOTATION_LABEL,
                    // roiId: roi.id,
                    title: className,
                    x: parseFloat(x - width/2),
                    y: parseFloat(y - height/2),
                    width: parseFloat(width),
                    height: parseFloat(height),
                    uuid
                  })
                  annotUpdates[uuid] = cls;
                }
              })
              console.log('UPdate from txt', annotUpdates, configuredData)
              setAnnotationMap(prev=>({...prev, ...annotUpdates}));
              // setRectangles(prev=>[...prev, ...configuredData]);
              newStat.rectangles = configuredData
          }
          setAnnotationLoadedFlag(prev=>{
            return {...prev, [selectedImage.id]: true};
          })
        }
        catch(e){
        }
        finally{
          setAnnotationClasses(prev=>({...prev, [selectedImage.id]: newStat}))
        }
      }
      getData();

      setAnnotationLoadedFlag(prev=>({...prev, [selectedImage.id]: true}))
    }
  }, [selectedImage])

  console.log(rectangles)

  const udpateAndExit = async () => {
    await updateAnnotation()
    nav('..', {relative: 'route'});
  }

  React.useEffect(()=>{
    if(selectedImage?.id){
      setRectangles(annotationClasses[selectedImage.id]?.rectangles || [] )
    }
  }, [annotationClasses, selectedImage])

  console.log(rectangles, annotationMap);

  return (
    <div className="grid h-screen grid-cols-12">
      <div className="col-span-3 grid grid-rows-12 border-r-[1px] border-black">
        <div className="row-span-11  bg-white flex flex-col">
          <h1 className=" border-b-[1px] px-6 pb-6 pt-6 text-3xl font-bold">
            Annotation Job
          </h1>
          <div className="flex flex-col gap-4 grow p-4">
            <AnnotationClass labelClass={labelClass}/>
            <AnnotationLabels labelClass={labelClass} selectedImageId={selectedImage?.id} />
          </div>
          <div className="border-t-[1px] border-black  py-2" style={{position: 'sticky'}}>
            <p className="text-center">{annotatedCount}/{images.length} Images Annotated</p>
            <Pagination/>
          </div>
        </div>
        <div className="row-span-1 flex items-center gap-2 border-t-[1px] border-black bg-white px-6">
          <Button variant="flat" size="xs" onClick={udpateAndExit}>
            Save & Exit
          </Button>
          <Button size="xs" onClick={updateAnnotation}>Save</Button>
        </div>
      </div>
      <div className="col-span-9 grid grid-rows-12">
        <div className="row-span-11 flex flex-col items-center justify-center gap-4 bg-[#EAEDF1]">
          <div
            className="flex h-full w-full flex-col items-center justify-center gap-4"
            style={{
              width: ((window.innerWidth - 16 * 4) * 9) / 12,
              maxHeight: '91.65vh'
            }}
          >
            {file && image?.width &&
              <KonvaImageView 
                onDrawStop={(rects)=>{
                  console.log('rect updated');
                  const annots = rects.filter(rect=>rect.rectType==RECTANGLE_TYPE.ANNOTATION_LABEL);
                  setAnnotationClasses(prev=>({...prev, [selectedImage.id]: {
                    ...prev[selectedImage.id],
                    rectangles: annots,
                    changed: true
                  }}))
                  let annotations = annots.filter(e=>annotationMap[e.uuid]==undefined);
                  if(annotations.length){
                    setAnnotationMap(prev=>{
                      const updates = {}
                      annotations.forEach(annot=>{
                        updates[annot.uuid] = selectedClassId.id
                      })
                      return {...prev, ...updates}
                    })
                    setSelectedPloyId(annotations[0].uuid)
                  }
                }}
                rectangles={annotationClasses[selectedImage.id] ? [...rois, ...annotationClasses[selectedImage.id].rectangles]: rois}
                title={selectedClass?.name || 'Label'}
                image={image}
                imageId={selectedImage?.id}
              />
            }
          </div>
        </div>

        <div className="flex items-center justify-between border-t-[1px] border-gray-400 bg-white">
          <Actions cancel={cancel} submit={submit} />
        </div>
      </div>
    </div>
  );
}
