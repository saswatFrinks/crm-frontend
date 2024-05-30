import Slider from '@/shared/ui/Slider';
import RecallChart from './RecallChart';
import MatrixChart from './MatrixChart';
import PredictedImage from './PredictedImage';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '@/core/request/aixosinstance';
import toast from 'react-hot-toast';
import ProjectCreateLoader from '@/shared/ui/ProjectCreateLoader';
import { getRandomHexColor } from '@/util/util';
import ResultPagination from '@/shared/ui/ResultPagination';

export default function Result() {
  const canvasSize = 500;
  const params = useParams();
  const [threshold, setThreshold] = useState(50);
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);

  const [cachedImages, setCachedImages] = useState(new Map());

  const [loader, setLoader] = useState(true);
  const [imageLoader, setImageLoader] = useState(false);
  const [imageLoader2, setImageLoader2] = useState(false);

  const abortControllerRef = useRef(null);
  const cacheAbortControllerRef = Array.from({length: 5}, () => useRef(null));

  const getFormattedBoxes = (boxes) => {
    return boxes.map((classItem, index) => ({
      ...classItem,
      x: (classItem.x1+classItem.x2)/2,
      y: (classItem.y1+classItem.y2)/2,
      width: Math.abs(classItem.x1-classItem.x2),
      height: Math.abs(classItem.y1-classItem.y2),
      id: index,
      title: `Class ${index+1}`,
    }))
  }

  const makeApiCallForImage = async (imageName, signal = null) => {
    const config = {
      params: {
        modelId: params.modelId,
        name: imageName
      },
      responseType: 'arraybuffer',
    };
  
    if (signal) {
      config.signal = signal;
    }
  
    const res = await axiosInstance.get('/model/result-image-data', config);

    const parsedClasses = JSON.parse(res.headers['x-annotations']).map(classItem => ({
      ...classItem,
      stroke: getRandomHexColor()
    }))

    const blob = new Blob([res.data], { type: 'image/png' });
    const url = window.URL.createObjectURL(blob);
    return {
      url,
      parsedClasses: getFormattedBoxes(parsedClasses)
    }
  }

  const getImageData = async (imageName) => {
    let index;
    try {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;

      if(imageLoader === false){
        index = 0;
        setImageLoader(true);
      }else if(imageLoader2 === false){
        index = 1;
        setImageLoader2(true);
      }
      const data = await makeApiCallForImage(imageName, signal);

      if (signal.aborted) {
        return;
      }
      setCachedImages(prev => {
        prev.set(imageName, data);
        return prev;
      })
    } catch (error) {
      const isAborted = error?.config?.signal?.aborted;
      if(!isAborted)toast.error(error?.response?.data?.data?.message);
    } finally {
      if(index === 0){
        setImageLoader(false);
      }else if(index === 1){
        setImageLoader2(false);
      }
    }
  };

  const getModelData = async () => {
    try {
      setLoader(true);
      const response = await axiosInstance.get('/model/result-images-list', {
        params: {
          modelId: params.modelId,
        }
      });

      setImages(response?.data?.data)
    } catch (error) {
      toast.error(error?.response?.data?.data?.message)
    } finally {
      setLoader(false);
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

  const deleteBlob = (imageName, imageCache) => {
    if(imageCache.has(imageName)){
      URL.revokeObjectURL(imageCache.get(imageName).url);
      imageCache.delete(imageName);
    }
  }

  const deleteOlderCaches = (pageNum) => {
    const persistRange = [pageNum-4, pageNum-3, pageNum+3, pageNum+4];
    let cacheAfterDelete = new Map(cachedImages);
    persistRange.forEach(index => {
      if(index > 1 && index < images.length && cacheAfterDelete.size > 10){
        deleteBlob(images[index-1], cacheAfterDelete);
      }
    })
    setCachedImages(cacheAfterDelete);
    return cacheAfterDelete;
  }

  const cacheImages = async (pageNum) => {
    try {
      const cacheAfterDelete = deleteOlderCaches(pageNum);
      const cacheMap = new Map(cacheAfterDelete);
      const promises = [];

      cacheAbortControllerRef.forEach(r => {
        if (r.current) {
          r.current.abort();
        }
      })
      
      for (let img = pageNum - 2; img <= pageNum + 2; img++) {
        let idx = img - (pageNum-2);
        cacheAbortControllerRef[idx].current = new AbortController();
        const { signal } = cacheAbortControllerRef[idx].current;
        let isUrlValid = false;
        if(cacheMap.has(images[img-1])){
          isUrlValid = await checkBlobURLValidity(cacheMap.get(images[img-1])?.url);
        }
        if (img <= 0 || img > images.length || isUrlValid) continue;
        const imageName = images[img - 1];
        promises.push(makeApiCallForImage(imageName, signal).then(data => {
          if (signal.aborted) {
            return;
          }
          cacheMap.set(imageName, data);
        }));
      }
      
      await Promise.all(promises);
      setCachedImages(cacheMap);
    } catch (error) {
      const isAborted = error?.config?.signal?.aborted;
      if(!isAborted)toast.error(error?.response?.data?.data?.message);
    }
  }

  useEffect(() => {
    if(images?.length > 0){
      const data = cachedImages.get(images[page-1])
      if(data){
        console.log('data', data, page)
        checkBlobURLValidity(data.url).then(isValid => {
          if (isValid) {
            setImageLoader(false);
            setImageLoader2(false);
          } else {
            setCachedImages(prev => {
              prev.delete(images[page-1]);
              return prev;
            })
            getImageData(images[page-1]);
          }
        });
      }else{
        getImageData(images[page-1]);
      }
      cacheImages(page);
    }
  }, [page, images])

  useEffect(() => {
    getModelData()

    return () => {
      cachedImages.forEach((value, key) => {
        URL.revokeObjectURL(value.url);
      });
      setCachedImages(new Map());
    }
  }, [])

  return (
    <div className="grid gap-4">
      {loader && <ProjectCreateLoader title='Fetching Images'/>}
      <ul className="flex gap-12">
        <li>Training Data: 120 images</li>

        <li>Testing Data: 60 images</li>

        <li>Validation Data: 70 images</li>
      </ul>

      <h3 className="text-2xl font-semibold">Validation Results</h3>

      <p>
        Review the validation results properly before deploying the AI model.
        Compare the ground truth with prediction to check the model accuracy.
        You can adjust the confidence threshold and iou threshold to observe the
        changes in the model prediction. If the results are not satisfactory,
        retrain the model with more data on cases where it is currently failing
        or change the model parameters.
      </p>

      <div className="flex items-center justify-center gap-8">
        <div className="w-full max-w-lg flex flex-col items-center gap-4">
          <div
            className='border-black flex items-center justify-center'
            style={{
              height: canvasSize,
              width: canvasSize
            }}
          >
            {(imageLoader || imageLoader2) ? (
              <div className="loading px-4 text-center" style={{width: canvasSize/2}}></div>
            ) : (
              <img
                src={cachedImages.get(images[page-1])?.url}
                style={{
                  maxWidth: canvasSize,
                  maxHeight: canvasSize
                }}
              />
            )}
          </div>
          <div className='font-medium text-xl'>Actual</div>
        </div>

        <div
          className='flex flex-col items-center gap-4'
        >
          <div
            className='border-black flex items-center justify-center'
            style={{
              height: canvasSize,
              width: canvasSize
            }}
          >
            {(imageLoader || imageLoader2) ? (
              <div className="loading px-4 text-center" style={{width: canvasSize/2}}></div>
            ) : (
              <>
                {(cachedImages.get(images[page-1])?.url) && (
                  <PredictedImage 
                    threshold={threshold} 
                    canvasSize={canvasSize} 
                    shapeProps={cachedImages.get(images[page-1])?.parsedClasses} 
                    url={cachedImages.get(images[page-1])?.url} 
                  />
                )}
              </>
            )}
          </div>
          <div className='font-medium text-xl'>Prediction</div>
        </div>
      </div>

      <ResultPagination page={page} setPage={setPage} total={images?.length} />

      <div className="flex flex-col items-center gap-4">
        <Slider title={'Confidence Threshold:'} id="confidence" value={threshold} setValue={setThreshold} />
        {/* <Slider title={'IOU Threshold:'} id="iou" /> */}
      </div>

      <h3 className="text-2xl font-semibold">Training Results</h3>

      <p>
        The below graphs helps you visualise the training results. You can
        understand the false positive and false negative of the trained model
        from the confusion matrix. And the precision-recall curve helps you
        understand the performance of the model. Click here to understand more
        about these two metrics.
      </p>

      <div className="flex items-center justify-center gap-4">
        <div className="w-full max-w-2xl">
          <MatrixChart />
        </div>

        <div className="w-full max-w-2xl">
          <RecallChart />
        </div>
      </div>
    </div>
  );
}
