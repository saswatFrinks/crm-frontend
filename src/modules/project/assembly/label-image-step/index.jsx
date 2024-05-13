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
import { RECTANGLE_TYPE } from "@/core/constants";
import Button from '@/shared/ui/Button';

export default function LabelImage() {
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

  const setRectangle = useSetRecoilState(rectanglesAtom);
  const images = useRecoilValue(uploadedFileListAtom);
  const [selectedFile, setSelectedFile] = useRecoilState(selectedFileAtom)
  const [selectedPolyId, setSelectedPloyId] = useRecoilState(currentRectangleIdAtom)

  const removeRectangle = (id) => {
    setRectangle((t) => t.filter((k) => k.id !== id));
    const temp = annotationMap
    delete temp[id]
    setAnnotationMap(temp)
  };

  useEffect(()=>{
    addClasses()
  },[])

  const addClasses = () => {
    const temp = {}
    configuration.rois.forEach((roi)=> {
      roi.parts.forEach((obj)=> {
        temp[obj.className] = temp[obj.className] ? temp[obj.className]+1 : 0
      })
    })
    setLabelClasses(Object.keys(temp).map((key, index)=> ({
      id: index,
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
    const annotations = selectedRois.filter(e=>e.rectType==RECTANGLE_TYPE.ANNOTATION_LABEL && !annotationMap[e.id]);
    if(annotations.length){
      setSelectedPloyId(annotations[0].id)
      const updates = {}
      annotations.forEach(annot=>{
        updates[annot.id] = selectedLabel.name
      })
      setAnnotationMap(p=>({...p, ...updates}))
    }
  }, [selectedRois])

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
          <Button size='sm' variant='flat'>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
