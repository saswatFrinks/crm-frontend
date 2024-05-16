import Button from '@/shared/ui/Button';

import UploadImage from './components/UploadImage';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { ACTION_NAMES, ASSEMBLY_CONFIG, BASE_RECT, DEFAULT_ASSEMBLY, DEFAULT_ROI, RECTANGLE_TYPE, STATUS } from '@/core/constants';
import Steps from './components/Steps';
import UploadImageStep from './upload-image-step';
import InspectionParameterStep from './inspection-parameter-step';
import LabelImage from './label-image-step';
import PreTrainingStep from './pre-training-step';
import ProjectCreateLoader from '@/shared/ui/ProjectCreateLoader';
import Actions from './components/Actions';
import {useParams} from 'react-router-dom'

import { editingRectAtom, loadedLabelsAtom, stepAtom } from './state';
import { useEffect, useState } from 'react';
import axiosInstance from '@/core/request/aixosinstance';
import { annotationMapAtom, assemblyAtom, currentRectangleIdAtom, currentRoiIdAtom, editingAtom, lastActionNameAtom, rectanglesAtom, rectanglesTypeAtom, uploadedFileListAtom } from '../state';
import { useNavigate } from 'react-router-dom';
import { cloneDeep } from "lodash";
import toast from 'react-hot-toast';
import { getRandomHexColor } from '@/util/util';

export default function Assembly() {
  const [isEditing, setIsEditing] = useRecoilState(editingAtom);
  const setRectangleType = useSetRecoilState(rectanglesTypeAtom);
  
  const {projectId, configurationId} = useParams()

  const [type, setType] = useState(ASSEMBLY_CONFIG.STATIONARY)
  const [configuration, setConfiguration] = useRecoilState(assemblyAtom);

  const [currentRoiId, setCurrentRoiId] = useRecoilState(currentRoiIdAtom);
  

  const [isEditingRect, setEditingRect] = useRecoilState(editingRectAtom);

  const [step, setStep] = useRecoilState(stepAtom);
  const rois = useRecoilValue(rectanglesAtom).filter((t)=>t.rectType==RECTANGLE_TYPE.ROI)
  const annotationRects = useRecoilValue(rectanglesAtom).filter((t)=>t.rectType==RECTANGLE_TYPE.ANNOTATION_LABEL)
  const [annotationMap, setAnnotationMap] = useRecoilState(annotationMapAtom)
  const [selectedRectId, setSelectedRectId] = useRecoilState(currentRectangleIdAtom)
  const setLastAction = useSetRecoilState(lastActionNameAtom);
  const setRectangles = useSetRecoilState(rectanglesAtom);
  const setLabelsLoaded = useSetRecoilState(loadedLabelsAtom)

  const getProject = async () => {
    try {
      const {data} = await axiosInstance.get('/project', {
        params: {
          projectId
        }
      })
      !data.data.isItemFixed && setType(ASSEMBLY_CONFIG.MOVING)
      console.log(configuration, data.data)
    } catch (error) {
      console.log(error)
    }
  }
  const [images, setImages] = useRecoilState(uploadedFileListAtom);

  const canGoNext = !(images.length !== 10 || (step == 0 && images.some(img => !img)));
  const navigate = useNavigate();

  const handleNext = async () => {
    let t = step;
    if(!canGoNext) t = 0;
    else if (t==0){
      await getRois();
      t++;
    }
    else if(t==1){
      t = await prepareApiData() ? t+1: t;
    }
    else if(t==2){
      t = await preUpdate() ? t+1: t;
    }
    else if (t != 3) t +=1;
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
    setCurrentRoiId(null)
    setRectangleType(RECTANGLE_TYPE.ROI)
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
    setRectangleType(RECTANGLE_TYPE.ROI)
  };
  
  const preUpdate = () => {
    console.log('pre update')
    return new Promise((res, rej)=>{
      const image = new Image();
      image.src = images[0].url
      console.log('inside proimse')
      image.onload = ()=>updateAnnotation(image).then(success=>{
        if(success) res(true);
        else res(false);
      }).catch(()=>res(false));
    })
  }
  const stepObj = {
    0: <UploadImageStep />,
    1: <InspectionParameterStep type={type}/>,
    2: <LabelImage save={preUpdate}/>,
    3: <PreTrainingStep />,
  };

  const getRois = async () => {
    try{
      const roiData = await axiosInstance.get('/configuration/classes', {
        params: {
          configurationId
        }
      })
      const data = JSON.parse(roiData.data.data?.data)
      console.log(data);
      if(data.length){
        const partsMap = {};
        const roiMap = {};
        const rects = []
        let configUpdate = {productFlow: data[0].configuration.direction }, configUpdateRequired = false;
        
        console.log('Hello')
        data?.forEach((conf, i)=>{
          const roiId = conf.rois.id;
          console.log('Loop', roiId)
          if(!roiMap[roiId]){
            console.log('roi id not present')
            roiMap[roiId] = {
              id: i,
              checked: false,
              status: STATUS.FINISH,
              open: true,
              parts: []
            }
            //!do rectangle here too
            console.log('before')
            const {width, height, x, y} = conf.rois;
            console.log('before')
            const color = getRandomHexColor();
            rects.push({
                ...BASE_RECT, 
                id: rois.length + i,
                fill: color,
                stroke: color,
                imageId: images[0].id,
                rectType: RECTANGLE_TYPE.ROI,
                roiId:i,
                title: 'ROI',
                x: Math.ceil(x - width/2),
                y: Math.ceil(y - height/2),
                width,
                height
            })
          }
          if(!partsMap[roiId]){
            partsMap[roiId] = [];
          }
          console.log('doing parts')
          if(conf.parts.isTracker){
            configUpdateRequired = true;
            configUpdate = {
              ...configUpdate,
              primaryObject: conf.parts?.name || '',
              primaryObjectClass: conf.parts?.name || '',
            }
          }
          partsMap[roiId].push({
            id: i,
            objectName: conf.parts?.name || '',
            class: conf.parts?.classId || '',
            className: conf.assembly_class?.name || '',
            operation: conf.parts?.operator,
            qty: conf.parts?.count,
            classify: conf.assembly_class?.classify ? 'on': false,
            checked : false,
            open: true
          })
        })
        console.log(roiMap, partsMap)
        for(let roiId in roiMap){
          roiMap[roiId].parts = partsMap[roiId];
        }
        setConfiguration((t) => ({
          ...t,
          rois: Object.values(roiMap)
        }));
        setRectangles(prev=>[...prev, ...rects]);
        if(configUpdateRequired){
          setConfiguration(prev=>({
            ...prev, 
            ...configUpdate
          }))
        }
      }
      return true
    }
    catch(e){
      return false;
    }
  }

  useEffect(()=>{
    getProject()
    setLabelsLoaded(Array.from({length: 10}, ()=>false))
    setConfiguration(DEFAULT_ASSEMBLY)
  },[])


  const prepareApiData = async()=>{
    console.log("contorl here")
    const imgMap = {}
    const temp = cloneDeep(configuration)
    temp.direction = parseInt(temp.productFlow)
    temp.id = configurationId
    delete temp.productFlow
    temp.rois = temp.rois.map((roi, index)=>{
      const tempParts = roi.parts.map((part)=>{
        return {
          classify: part.classify=='on',
          class: part.class,
          name: part.objectName,
          count: part.qty,
          operator: part.operation
        }
      })
      let x, width, y, height
      console.log(roi.id, rois.map(ele=>ele.roiId))
      rois.forEach((roiRect)=>{
        if(roi.id==roiRect.roiId){
          x = parseFloat((roiRect.x + roiRect.width/2).toFixed(4))
          width = parseFloat((roiRect.width).toFixed(4))
          y = parseFloat((roiRect.y+roiRect.height/2).toFixed(4))
          height = parseFloat((roiRect.height).toFixed(4))
        }
      })
      return {
        name: `ROI ${index}`,
        x,
        width,
        y,
        height,
        parts: tempParts
      }
    })
    if(temp.direction!=0){
      temp.rois[0].primaryObject = {
        name: temp.primaryObject,
        class: temp.primaryObjectClass,
      }
    }
    delete temp.primaryObject
    delete temp.primaryObjectClass
    const formData = new FormData();
    // await Promise.all(images.map(async(img, index)=>{
    //   const resp = await fetch(img.url)
    //   const blob = await resp.blob()
    //   formData.append('images', blob, img.name)
    // }))
    formData.append('data', JSON.stringify(temp))
    formData.append('configurationId', configurationId)
    formData.append('isGood', JSON.stringify([true, true, true, true, true, false, false, false, false, false]))
    try{
      const data = await axiosInstance.post("/configuration/assembly", formData)
      toast.success("ROIs uploaded")
      return data.data?.success
    }
    catch(e){
      toast.error(e?.response?.data?.data?.message ? `${e?.response?.data?.data?.message}. All fields are required`: 'Failed')
    }
  }

  const updateAnnotation = async (image) => {
    const imgMap = {};
    annotationRects.forEach((rect)=>{
      const classNo = annotationMap[rect.id]
      const height = (rect.height/image.height).toFixed(4)
      const width = (rect.width/image.width).toFixed(4)
      const x = ((rect.x+rect.width/2)/image.width).toFixed(4)
      const y = ((rect.y+rect.height/2)/image.height).toFixed(4)
      if(imgMap[rect.imageId]){
        imgMap[rect.imageId]+= `${classNo} ${x} ${y} ${width} ${height}\n`
      }else{
        imgMap[rect.imageId] = `${classNo} ${x} ${y} ${width} ${height}\n`
      }
    })
    const formData = new FormData();
    const imageIds = []
    await Promise.all(images.map(async(img, index)=>{
      const fileContents = imgMap[img.id] || ""
      const fileBlob = new Blob([fileContents], { type: 'text/plain' })
      formData.append('files', fileBlob, img.id)
      imageIds.push(img.id || '');
    }))
    formData.append('configurationId', configurationId);
    formData.append('imageIds', imageIds);
    try{
      const data = await axiosInstance.post("/configuration/upload-label-files", formData)
      toast.success("Labels uploaded")
      return data.data?.success
    }
    catch(e){
      toast.error(e?.response?.data?.data?.message ? `${e?.response?.data?.data?.message}. All fields are required`: 'Failed')
    }
  }

  return (
    <>
      <div className="grid h-screen grid-cols-12 ">
        <div className="col-span-5 grid grid-rows-12 border-r-[1px] border-gray-400" style={{maxHeight: '100vh', overflow: 'hidden'}}>
          <div className="row-span-11 bg-white flex flex-col" style={{maxHeight: '91.65vh', overflowY: 'auto'}}>
            <h1 className="mb-4 px-6 pt-6 text-3xl font-bold">
              Assembly Configuration
            </h1>

            <Steps />

            <div
              className="p-6 pb-0 flex flex-col grow"
              style={{
                // height: calcHeight(),
              }}
            >
              {stepObj[step]}
            </div>
          </div>

          <div className=" flex justify-center border-t-[1px] border-gray-400 bg-white">
            <div className="flex max-w-md flex-1 items-center justify-center gap-4">
              <Button size="xs" variant="border" onClick = {() => navigate(-1)} >
                Cancel
              </Button>
              {
                step > 0 && (
                  <Button size="xs" variant="flat" onClick={handlePrev}>
                    Back
                  </Button>
                )
              }
              {canGoNext && (
                <Button size="xs" onClick={handleNext}>
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-7 grid grid-rows-12">
          <div className="row-span-11 flex flex-col items-center justify-center gap-4 bg-[#EAEDF1]" style={{overflow: 'hidden'}}>
            <UploadImage />
          </div>

          <div className="flex items-center justify-between border-t-[1px] border-gray-400 bg-white">
            <Actions cancel={cancel} submit={submit} />
          </div>
        </div>
      </div>
      {false && (
        <ProjectCreateLoader title="Please wait while we analyse the project..." />
      )}
    </>
  );
}
