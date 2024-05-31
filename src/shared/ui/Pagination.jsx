import axiosInstance from '@/core/request/aixosinstance';
import { annotationCacheAtom, cacheLoaderAtom, selectedFileAtom, uploadedFileListAtom } from '@/modules/project/state';
import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'react-feather';
import toast from 'react-hot-toast';
import { useRecoilState, useRecoilValue } from 'recoil';

export default function Pagination({chevornsMovement=5}) {
  const allImages = useRecoilValue(uploadedFileListAtom);
  const [selectedImage, setSelectedImage] = useRecoilState(selectedFileAtom);
  const [cachedImages, setCachedImages] = useRecoilState(annotationCacheAtom);
  const [loaders, setLoaders] = useRecoilState(cacheLoaderAtom);

  const [currentIndex, setCurrentIndex] = useState(0)

  let i = Math.min(Math.max(currentIndex -3, 0), allImages.length-6);
  const paginationBar = allImages?.length < 6 ? 
    Array.from({length: allImages.length}, (v,k)=>k+1) :
    Array.from({length: 6}, (v,k)=>i+k+1)
  // const chevornsMovement = 5;
  let cacheAbortControllerRef = Array.from({length: 5}, () => useRef());

  const changeLoader = (imageId, flag) => {
    setLoaders(() => {
      const newLoaders = new Map();
      flag ? newLoaders.set(imageId, flag) : newLoaders.delete(imageId);
      return newLoaders;
    })
  }

  const makeApiCallForImage = async (imageId, signal = null) => {
    try {
      const config = {
        params: {imageId},
        responseType: 'arraybuffer',
      };
    
      if (signal) {
        config.signal = signal;
      }
    
      const res = await axiosInstance.get('/dataset/image', config);
  
      const blob = new Blob([res.data], { type: 'image/png' });
      const url = window.URL.createObjectURL(blob);
      return url;
    } catch (error){
      const isAborted = error?.config?.signal?.aborted;
      if(!isAborted)toast.error(error?.response?.data?.data?.message);
    }
  }

  const checkBlobURLValidity = (blobURL) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = blobURL;
    });
  };

  const deleteBlob = (imageId, imageCache) => {
    if(imageCache.has(imageId)){
      URL.revokeObjectURL(imageCache.get(imageId).url);
      imageCache.delete(imageId);
    }
  }

  const deleteOlderCaches = (pageNum) => {
    const persistRange = [pageNum-4, pageNum-3, pageNum+3, pageNum+4];
    let cacheAfterDelete = new Map(cachedImages);
    persistRange.forEach(index => {
      if(index > 0 && index < (allImages.length - 1) && cacheAfterDelete.size > 10){
        deleteBlob(allImages[index]?.id, cacheAfterDelete);
      }
    })
    setCachedImages(cacheAfterDelete);
    return cacheAfterDelete;
  }
  
  const cacheImages = async (index) => {
    try {
      const cacheAfterDelete = deleteOlderCaches(index);
      const cacheMap = new Map(cacheAfterDelete);
      const promises = [];

      cacheAbortControllerRef.forEach(r => {
        if (r.current) {
          r.current.abort();
        }
      })
      
      for (let img = index - 2; img <= index + 2; img++) {
        let idx = img - (index-2);
        cacheAbortControllerRef[idx].current = new AbortController();
        const { signal } = cacheAbortControllerRef[idx].current;
        let isUrlValid = false;
        const imageId = allImages[img]?.id;
        if(cacheMap.has(imageId)){
          isUrlValid = await checkBlobURLValidity(cacheMap.get(imageId)?.url);
          if(img === index && isUrlValid){
            setSelectedImage(cacheMap.get(imageId));
            changeLoader(imageId, false);
          }
        }
        if (img < 0 || img >= allImages.length || isUrlValid) {
          continue;
        }
        if(img === index){
          const url = await makeApiCallForImage(imageId, signal);
          const data = {
            ...allImages[img],
            url
          }
          if (signal.aborted) {
            return;
          }
          cacheMap.set(imageId, data);
          setSelectedImage(data);
          changeLoader(imageId, false)
        }else{
          promises.push(makeApiCallForImage(imageId, signal).then(url => {
            if (signal.aborted) {
              return;
            }
            const data = {
              ...allImages[img],
              url
            }
            cacheMap.set(imageId, data);
            setCachedImages(cacheMap);
          }));
        }
      }
      await Promise.all(promises);
      setCachedImages(cacheMap);
    } catch (error) {
      const isAborted = error?.config?.signal?.aborted;
      if(!isAborted)toast.error(error?.response?.data?.data?.message);
    }
  }

  const setImage = (imageId, index) => {
    setCurrentIndex(index);
  }

  // const setCahcedImage = async (index) => {
  //   isUrlValid = await checkBlobURLValidity(cacheMap.get(imageId)?.url);
  //   if(isUrlValid){
  //     console.log({chached: cacheMap.get(imageId)})
  //     setSelectedImage(cacheMap.get(imageId));
  //     changeLoader(imageId, false);
  //   }
  // }

  useEffect(() => {
    if(cachedImages.has(allImages[currentIndex]?.id)){
      setSelectedImage(cachedImages.get(allImages[currentIndex]?.id))
    }
    changeLoader(allImages[currentIndex]?.id, true);
    setSelectedImage(allImages[currentIndex])
    cacheImages(currentIndex)
  }, [currentIndex, allImages])

  return (
    <nav className="flex items-center">
      <ul className="mx-auto flex gap-2 rounded-full border border-gray-300 px-2 py-1.5">
      <li onClick={()=>setImage(allImages[Math.max(currentIndex-chevornsMovement, 0)]?.id, Math.max(currentIndex-chevornsMovement, 0))} className='cursor-pointer'>
          <ChevronsLeft />
        </li>
        <li onClick={()=>currentIndex!==0 && setImage(allImages[currentIndex-1]?.id, currentIndex-1)} className='cursor-pointer'>
          <ChevronLeft />
        </li>
        {!paginationBar.includes(1) &&<li>...</li>}
        {paginationBar.map(e=>{
          return (<li className={e==currentIndex+1? 'font-semibold cursor-pointer': 'text-gray-400 cursor-pointer'} onClick={()=>{setImage(allImages[e-1]?.id, e-1)}}>{e}</li>)
        })}
        {!paginationBar.includes(allImages?.length) &&<li>...</li>}
        <li onClick={()=>currentIndex+1!==allImages.length && setImage(allImages[currentIndex+1]?.id, currentIndex+1)} className='cursor-pointer'>
          <ChevronRight />
        </li>
        <li onClick={()=>setImage(allImages[Math.min(currentIndex+chevornsMovement, allImages.length-1)]?.id, Math.min(currentIndex+chevornsMovement, allImages.length-1))} className='cursor-pointer'>
          <ChevronsRight />
        </li>
      </ul>
     </nav>
  );
}
