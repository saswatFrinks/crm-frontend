import axiosInstance from '@/core/request/aixosinstance';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

export default function MatrixChart() {
  const params = useParams();
  const [imageUrl, setImageUrl] = useState(null);
  const [loader, setLoader] = useState(false);

  const getConfusionMatrix = async () => {
    try{
      console.log('in func')
      setLoader(true);
      const res = await axiosInstance.get('/model/confusion-matrix', {
        params: {
          modelId: params.modelId,
        },
        responseType: 'arraybuffer'
      });

      const blob = new Blob([res.data], { type: 'image/png' });
      const url = window.URL.createObjectURL(blob);
      setImageUrl(url);
    } catch(error){
      toast.error(error?.response?.data?.data?.message);
    } finally{
      setLoader(false);
    }
  }

  useEffect(() => {
    getConfusionMatrix()
  }, [])

  return (
    <div className="flex gap-4 items-center justify-center">
      {loader ? (
        <div className="loading px-4 text-center" style={{width: '20vw'}}></div>
      ) : (
        <>
          {imageUrl && <img
            src={imageUrl}
            alt='Confusion Matrix'
            style={{
              width: '25vw',
              height: 'auto'
            }}
          />}
        </>
      )}
    </div>
  );
}
