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

  const selectedRois = useRecoilValue(selectedRoiSelector(selectedImage?.id));

  const [rectangles, setRectangle] = useRecoilState(rectanglesAtom);
  const images = useRecoilValue(uploadedFileListAtom);
  const [selectedFile, setSelectedFile] = useRecoilState(selectedFileAtom)
  const [selectedPolyId, setSelectedPloyId] = useRecoilState(currentRectangleIdAtom)
  const [loadedLabelData, setLoadedLabelData] = useRecoilState(loadedLabelsAtom)
  const params = useParams();
  const labelsRef = React.useRef(labelClasses);

  const removeRectangle = (id) => {
    setRectangle((t) => t.filter((k) => k.id !== id));
    const temp = {...annotationMap}
    delete temp[id]
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
    setLabel({
      name: labelClasses[i].name,
      count: labelClasses[i].count,
      id: labelClasses[i].id
    })
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
    setAnnotationMap(prev=>{
      const updates = {}
      annotations = selectedRois.filter(e=>e.rectType==RECTANGLE_TYPE.ANNOTATION_LABEL && prev[e.id]==undefined);
      if(annotations.length){
        annotations.forEach(annot=>{
          updates[annot.id] = selectedLabel.id
        })
      }
      return {...prev, ...updates}
    })
    if(annotations.length){
      setSelectedPloyId(annotations[0].id)
    }
  }, [selectedRois])

  React.useEffect(()=>{
    const ind = images.findIndex(im=> im.id === selectedFile.id);
    if(ind >=0 && !loadedLabelData[ind]){
      const getData = async () => {
        const data = await axiosInstance.get('/configuration/label-file', {
          params: {
            configurationId: params.configurationId,
            imageId: selectedFile.id
          }
        })
        const prevData = data?.data;
        if(prevData.length && typeof prevData == 'string'){
          const image = new Image();
          image.src = selectedFile.url;
          image.onload = () => {
            const configuredData = []
            const annotUpdates = {}
            prevData.split('\n').forEach((entry, i)=>{
              const line = entry.split(' ');
              if(line.length>=5){
                let [cls, x, y, width, height] = line;
                x *= image.width;
                y *= image.height;
                width *= image.width;
                height *= image.height;

                const className = labelsRef.current?.find(ele=>ele.id==cls)?.name

                const color = getRandomHexColor();
                const id = selectedFile.id;
                configuredData.push({
                  ...BASE_RECT, 
                  id: selectedRois.length + i,
                  fill: color,
                  stroke: color,
                  imageId: id,
                  rectType: RECTANGLE_TYPE.ANNOTATION_LABEL,
                  // roiId: roi.id,
                  title: className,
                  x: x - width/2,
                  y: y - height/2,
                  width,
                  height
                })
                annotUpdates[selectedRois.length + i] = cls;
              }
            })
            console.log('UPdate from txt', annotUpdates, configuredData)
            setAnnotationMap(prev=>({...prev, ...annotUpdates}));
            setRectangle(prev=>([...prev, ...configuredData]));
          }

        }

        setLoadedLabelData(prev=>{
          const d = [...prev];
          d[ind] = true;
          return d;
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
                value={annotationMap[t.id]}
                onChange={(e)=>{
                  //!update rectangle class tooo, title
                  const ind = rectangles.findIndex(ele=>ele.id==t.id);
                  const recCp = [...rectangles];
                  recCp[ind] = {...recCp[ind], title: labelClasses.find(ele=>ele.id==e.target.value).name}
                  setRectangle(recCp)
                  setAnnotationMap({...annotationMap, [t.id]: e.target.value})
                }}
                />
              </div>
            </div>
            <Edit size={18} className='cursor-pointer mr-4' onClick={()=>setSelectedPloyId(t.id)}/>
            <Trash
              size={18}
              className="cursor-pointer"
              onClick={() => removeRectangle(t.id)}
            />
          </div>
        )}
      </div>
      <div className='sticky bottom-0 bg-white relative'>
        <div className='flex justify-center align-center'>
          <div className='flex border border-grey-400 p-1 px-3 rounded-full gap-1'>
          {/* <button className='hover:bg-blue-100 p-1 px-3 rounded-full'>
              <ChevronsLeft
                  size={20}
                  className={`cursor-pointer duration-100`}
                  onClick={() => console.log('left')}
                />
            </button> */}
            <button className={`${curIndex == 0 ? 'hover:bg-white': 'hover:bg-blue-100'}  p-1 px-3 rounded-full`} onClick={()=>changeImageFile(false)}>
              <ChevronLeft
                  size={24}
                  className={`cursor-pointer duration-100 ${curIndex==0? 'text-grey-400': ''}`}
                  onClick={() => console.log('left')}
                />
            </button>
            {images.map((image, i)=>(
              <Button size='sm' variant='flat' className={selectedFile.id === image.id?'bg-blue-100':'bg-white'} onClick={()=>selectedFile.id != image.id && setSelectedFile(image)}>
                <span className={selectedFile.id === image.id? 'text-black': 'text-gray-400'}>{i+1}</span>
              </Button>
            ))}
            <button className={`${curIndex+1 == images.length ? 'hover:bg-white': 'hover:bg-blue-100'} p-1 px-3 rounded-full`} onClick={()=>changeImageFile(true)}>
              <ChevronRight
                  size={24}
                  className={`cursor-pointer duration-100`}
                  onClick={() => console.log('left')}
                />
            </button>
            {/* <button className='hover:bg-blue-100 p-1 px-3 rounded-full'>
              <ChevronsRight
                  size={20}
                  className={`cursor-pointer duration-100`}
                  onClick={() => console.log('left')}
                />
            </button> */}
          </div>
        </div>
        <div className='absolute right-0 top-0 pt-1'>
          <Button size='sm' variant='flat' onClick={save}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
