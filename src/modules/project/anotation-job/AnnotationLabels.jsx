import React from 'react';

import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import Select from '@/shared/ui/Select';
import { Edit, Trash } from 'react-feather';
import { annotationMapAtom, currentRectangleIdAtom, rectanglesAtom, selectedFileAtom, uploadedFileListAtom } from '../state';
import { RECTANGLE_TYPE } from '@/core/constants';

export default function AnnotationLabels({labelClass}) {
  const selectedImage = useRecoilValue(selectedFileAtom);
  const [allRects, setAllReacts] = useRecoilState(rectanglesAtom);
  const rectangles = allRects.filter(rect=>rect.rectType==RECTANGLE_TYPE.ANNOTATION_LABEL)
  const [annotMap, setAnnotMap] = useRecoilState(annotationMapAtom);
  const selectedRectangleId = useSetRecoilState(currentRectangleIdAtom)
  const selecteFile = useRecoilValue(selectedFileAtom)
  
  const selectedImageId = selecteFile?.id

  const remove = (id, uuid) => {
    let newMap = Object.assign({}, annotMap);
    delete newMap[uuid];
    const newList = allRects.filter(e=>e.uuid!==uuid);
    setAnnotMap(newMap);
    setAllReacts(newList);
    console.log(newMap, newList);
  };
  const selectClass = (id) => {};
  return (
    <div>
      <p className="mb-4 break-all px-2">
        Current labels for {' '}
        <span className="font-semibold">{selectedImage?.name}</span>
      </p>
      <div
        className="flex h-[calc(100vh-478px)] flex-col gap-2 overflow-y-auto"
        onClick={() => selectClass('id')}
      >
        {rectangles.filter(ele=>ele.imageId==selectedImageId)
          .map((t, i) => (
            <div
              key={i}
              className="flex cursor-pointer items-center gap-4 px-4  py-1.5 duration-100 hover:bg-gray-100"
            >
              <span>{i + 1}.</span>
              <div className=" flex grow justify-center">
                <div className=" w-full max-w-sm">
                  <Select 
                    size="xs" 
                    options={labelClass}
                    value={annotMap[t.uuid]}
                    onChange={(e)=>{
                      const ind = rectangles.findIndex(ele=>ele.uuid==t.uuid);
                      const recCp = [...rectangles];
                      recCp[ind] = {...recCp[ind], title: labelClass.find(ele=>ele.id==e.target.value).name}
                      setAllReacts(recCp)
                      setAnnotMap(p=>({...p, [t.uuid]: e.target.value}))
                    }}
                  />
                </div>
              </div>
              <Edit size={18} className='cursor-pointer mr-4' onClick={()=>selectedRectangleId(t.uuid)}/>
              <Trash
                size={16}
                className="cursor-pointer"
                onClick={() => remove(t.id, t.uuid)}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
