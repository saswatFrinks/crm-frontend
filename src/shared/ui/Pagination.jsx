import { selectedFileAtom, uploadedFileListAtom } from '@/modules/project/state';
import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'react-feather';
import { useRecoilState, useRecoilValue } from 'recoil';

export default function Pagination({chevornsMovement=5}) {
  const allImages = useRecoilValue(uploadedFileListAtom);
  const [selectedImage, setSelectedImage] = useRecoilState(selectedFileAtom);

  const currentIndex = allImages.findIndex(e=>e&& selectedImage && e.id==selectedImage.id )

  let i = Math.min(Math.max(currentIndex -3, 0), allImages.length-6);
  const paginationBar = allImages?.length < 6 ? 
    Array.from({length: allImages.length}, (v,k)=>k+1) :
    Array.from({length: 6}, (v,k)=>i+k+1)
  // const chevornsMovement = 5;


  return (
    // <nav className="flex items-center">
      <ul className="mx-auto flex gap-2 rounded-full border border-gray-300 px-2 py-1.5">
      <li onClick={()=>setSelectedImage(allImages[Math.max(currentIndex-chevornsMovement, 0)])} className='cursor-pointer'>
          <ChevronsLeft />
        </li>
        <li onClick={()=>currentIndex!==0 && setSelectedImage(allImages[currentIndex-1])} className='cursor-pointer'>
          <ChevronLeft />
        </li>
        {currentIndex-3 >0 &&<li>...</li>}
        {paginationBar.map(e=>{
          return (<li className={e==currentIndex+1? 'font-semibold cursor-pointer': 'text-gray-400 cursor-pointer'} onClick={()=>{setSelectedImage(allImages[e-1])}}>{e}</li>)
        })}
        {currentIndex+3 < allImages?.length &&<li>...</li>}
        <li onClick={()=>currentIndex+1!==allImages.length && setSelectedImage(allImages[currentIndex+1])} className='cursor-pointer'>
          <ChevronRight />
        </li>
        <li onClick={()=>setSelectedImage(allImages[Math.min(currentIndex+chevornsMovement, allImages.length-1)])} className='cursor-pointer'>
          <ChevronsRight />
        </li>
      </ul>
    // </nav>
  );
}
