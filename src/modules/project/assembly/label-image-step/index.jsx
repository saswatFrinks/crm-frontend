import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { Trash } from 'react-feather';
import Select from '@/shared/ui/Select';
import {
  annotationMapAtom,
  assemblyAtom,
  editingAtom,
  labelClassAtom,
  rectanglesAtom,
  rectanglesTypeAtom,
  selectedFileAtom,
  selectedRoiSelector,
} from '../../state';
import { RECTANGLE_TYPE } from '@/core/constants';

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
  const setLabel = useSetRecoilState(labelClassAtom)
  const setRectangleType = useSetRecoilState(rectanglesTypeAtom)

  const selectedImage = useRecoilValue(selectedFileAtom);
  const setIsEditing = useSetRecoilState(editingAtom);

  const selectedRois = useRecoilValue(selectedRoiSelector(selectedImage?.id));

  const setRectangle = useSetRecoilState(rectanglesAtom);

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
  

  return (
    <div className="flex flex-col gap-4">
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
      <div className="flex flex-col gap-4">
        {selectedRois.map((t, i) => (
          <div key={t.id} className="flex items-center gap-4 ">
            <span>{i + 1}.</span>
             {t.rectType} {t.roiId != null ? t.roiId : t.id}
            <div className=" flex grow justify-center">
              <div className=" w-full max-w-sm">
                {t.rectType != RECTANGLE_TYPE.ROI && 
                <Select size="sm"
                options={labelClasses} 
                placeholder="Select class"
                value={annotationMap[t.id]}
                onChange={(e)=>{
                  setAnnotationMap({...annotationMap, [t.id]: e.target.value})
                }}
                />}
              </div>
            </div>
            <Trash
              size={16}
              className="cursor-pointer"
              onClick={() => removeRectangle(t.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
