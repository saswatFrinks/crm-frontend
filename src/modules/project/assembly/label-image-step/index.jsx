import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Edit, Trash } from 'react-feather';
import Select from '@/shared/ui/Select';
import {
  annotationMapAtom,
  assemblyAtom,
  currentRectangleIdAtom,
  editingAtom,
  labelClassAtom,
  rectanglesAtom,
  rectanglesTypeAtom,
  selectedFileAtom,
  selectedRoiSelector,
  uploadedFileListAtom,
} from '../../state';
import { BASE_RECT, RECTANGLE_TYPE } from "@/core/constants";
import Button from '@/shared/ui/Button';
import axiosInstance from '@/core/request/aixosinstance';
import { useParams } from 'react-router-dom';
import { getRandomHexColor } from '@/util/util';
import { loadedLabelsAtom } from '../state';
import Pagination from '@/shared/ui/Pagination';

export default function LabelImage({save}) {
  const configuration = useRecoilValue(assemblyAtom)
  const colors = [
    '#C6C4FF',
    '#7DDE86',
    '#FF9898',
    '#9BDCFD',
    '#FFD188',
    '#E3E5E5',
  ]

  const [labelClasses, setLabelClasses] = useState([])
  const [annotationMap, setAnnotationMap] = useRecoilState(annotationMapAtom)
  const [selectedLabel, setLabel] = useRecoilState(labelClassAtom)
  const setRectangleType = useSetRecoilState(rectanglesTypeAtom)

  const selectedImage = useRecoilValue(selectedFileAtom);
  const setIsEditing = useSetRecoilState(editingAtom);
  
  const images = useRecoilValue(uploadedFileListAtom);

  const [selectedFile, setSelectedFile] = useRecoilState(selectedFileAtom)
  const [rectangles, setRectangle] = useRecoilState(rectanglesAtom);
  const selectedRois  = rectangles.filter(rect=>rect.rectType==RECTANGLE_TYPE.ANNOTATION_LABEL && rect.imageId == selectedFile?.id);
  const selectedRoisRef = React.useRef(selectedRois);

  const [selectedPolyId, setSelectedPloyId] = useRecoilState(currentRectangleIdAtom)
  const [loadedLabelData, setLoadedLabelData] = useRecoilState(loadedLabelsAtom)
  const params = useParams();
  const labelsRef = React.useRef(labelClasses);

  const selectedLabelRef = React.useRef(selectedLabel);

  const removeRectangle = (uuid) => {
    setRectangle((t) => t.filter((k) => k.uuid !== uuid));
    const temp = {...annotationMap}
    delete temp[uuid]
    setAnnotationMap(temp)
  };

  useEffect(()=>{
    addClasses()
  },[])

  const addClasses = () => {
    const temp = {}
    const idMap = {}
    configuration.rois.forEach((roi)=> {
      roi.parts.forEach((obj)=> {
        temp[obj.className] = temp[obj.className] ? temp[obj.className]+1 : 0
        idMap[obj.className] = obj.class;
      })
    })
    setLabelClasses(Object.keys(temp).map((key, index)=> ({
      id: idMap[key],
      name: key,
      count: temp[key]
    })).sort((a,b)=> {
      return a.name > b.name? 1 : -1
    }))

  }

  const handleClassClick = async (e, i) => {
    setIsEditing(true)
    setRectangleType(RECTANGLE_TYPE.ANNOTATION_LABEL)
    const update = {
      name: labelClasses[i].name,
      count: labelClasses[i].count,
      id: labelClasses[i].id
    }
    setLabel(update)
    selectedLabelRef.current = {
      name: labelClasses[i].name,
      count: labelClasses[i].count,
      id: labelClasses[i].id
    }
  } 

  const curIndex = images.findIndex(image=>image.id==selectedFile.id)

  const changeImageFile = (next=true) => {
    if(next && curIndex+1<images.length){
      setSelectedFile(images[curIndex+1])
    }
    if(!next && curIndex>0){
      setSelectedFile(images[curIndex-1])
    }
  }

  React.useEffect(() => {
    let annotations = []
    annotations = selectedRois.filter(e=>e.rectType==RECTANGLE_TYPE.ANNOTATION_LABEL && annotationMap[e.uuid]==undefined);
    if(annotations.length){
      setAnnotationMap(prev=>{
        const updates = {}
        console.log(annotations, prev)
        annotations.forEach(annot=>{
          updates[annot.uuid] = selectedLabel.id
        })
        return {...prev, ...updates}
      })
    }
    if(annotations.length){
      setSelectedPloyId(annotations[0].uuid)
    }
  }, [selectedRois, annotationMap])

  React.useEffect(()=>{
    const ind = images.findIndex(im=> im.id === selectedFile.id);
    if(ind >=0 && !loadedLabelData[ind]){
      const getData = async () => {
        try{
          const data = await axiosInstance.get('/configuration/label-files', {
            params: {
              configurationId: params.configurationId,
            }
          })
          const loadedData = data?.data.data;
          if(loadedData.length){
            // console.log(loadedData, "got data"); return;
            const image = new Image();
            image.src = selectedFile.url;
            image.onload = () => {
              const configuredData = []
              const annotUpdates = {}
              loadedData.forEach(prevData=>{
                prevData.data.split('\n').forEach((entry, i)=>{
                  const line = entry.split(' ');
                  if(line.length>=5){
                    let [cls, x, y, width, height] = line;
    
                    const className = labelsRef.current?.find(ele=>ele.id==cls)?.name
    
                    const color = getRandomHexColor();
                    const id = prevData.imageId
                    const uuid = crypto.randomUUID();
                    configuredData.push({
                      ...BASE_RECT, 
                      id: selectedRoisRef.current.length + i,
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
              })
              console.log('UPdate from txt', annotUpdates, configuredData);
              setAnnotationMap(prev=>({...prev, ...annotUpdates}));
              setRectangle(prev=>([...prev, ...configuredData]));
            }
          }
        }
        catch(e){}

        setLoadedLabelData(prev=>{
          return Array.from({length: images.length}, ()=>true);
        })
      }
      getData();
    }
  }, [selectedFile])

  React.useEffect(()=>{
    labelsRef.current = labelClasses;
  }, [labelClasses])

  return (
    <div className="flex flex-col gap-4 grow">
      <p>Choose the class below you wish to label in the image</p>
      <ul className="flex flex-wrap gap-4">
        {labelClasses.map((t, index) => (
          <li
            key={t.name}
            className={`bg-[${colors[index%6]}] cursor-pointer rounded-md px-3 py-1.5`}
            onClick={(e)=> {handleClassClick(e, index)}}
          >
            {t.name}
          </li>
        ))}
      </ul>

      <div>
        Current labels for{' '}
        <span className="font-semibold">{selectedImage.fileName}</span>
      </div>     
      <div className="flex flex-col gap-4 grow overflow-y-auto">
        {selectedRois.filter(e=>e.rectType!==RECTANGLE_TYPE.ROI).map((t, i) => 
          <div key={t.id} className="flex items-center gap-4 ">
            <span>{i + 1}.</span>
            <div className=" flex grow">
              <div className=" w-full max-w-sm">
                <Select size="sm"
                  options={labelClasses} 
                  placeholder="Select class"
                  value={annotationMap[t.uuid]}
                  onChange={(e)=>{
                    //!update rectangle class tooo, title
                    const ind = rectangles.findIndex(ele=>ele.uuid==t.uuid && ele.rectType==RECTANGLE_TYPE.ANNOTATION_LABEL);
                    const recCp = [...rectangles];
                    recCp[ind] = {...recCp[ind], title: labelClasses.find(ele=>ele.id==e.target.value).name}
                    setRectangle(recCp)
                    setAnnotationMap({...annotationMap, [t.uuid]: e.target.value})
                  }}
                />
              </div>
            </div>
            <Edit size={18} className='cursor-pointer mr-4' onClick={()=>setSelectedPloyId(t.uuid)}/>
            <Trash
              size={18}
              className="cursor-pointer"
              onClick={() => removeRectangle(t.uuid)}
            />
          </div>
        )}
      </div>
      <div className='sticky bottom-0 bg-white flex flex-col items-center gap-2'>
        <Pagination chevornsMovement={10}/>
        <Button size='sm' variant='flat' onClick={save} style={{width: '260px'}} className='mb-2'>
          Save
        </Button>
      </div>
    </div>
  );
}
