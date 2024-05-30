import Slider from '@/shared/ui/Slider';
import RecallChart from './RecallChart';
import MatrixChart from './MatrixChart';
import PredictedImage from './PredictedImage';
import { useEffect, useState } from 'react';
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
  const [currentImage, setCurrentImage] = useState(null);

  const [cachedImages, setCachedImages] = useState(new Map());

  const [loader, setLoader] = useState(true);
  const [imageLoader, setImageLoader] = useState(false);

  const [classes, setClasses] = useState([]);

  const cachedClasses = cachedImages?.get(images[page-1])?.parsedClasses;
  const cachedImageUrl = cachedImages?.get(images[page-1])?.url;

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

  const makeApiCallForImage = async (imageName) => {
    const res = await axiosInstance.get('/model/result-image-data', {
      params: {
        modelId: params.modelId,
        name: imageName
      },
      responseType: 'arraybuffer'
    });

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
    try {
      setImageLoader(true);
      const data = await makeApiCallForImage(imageName);
      if(imageName === images[page-1]){
        setClasses(data.parsedClasses)
        setCurrentImage(data.url)
      }
    } catch (error) {
      toast.error(error?.response?.data?.data?.message);
    } finally {
      setImageLoader(false);
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

  const cacheImages = async (pageNum) => {
    try {
      const cacheMap = new Map(cachedImages);
      const promises = [];
      
      for (let img = pageNum - 1; img <= pageNum + 1; img++) {
        if (img <= 0 || img > images.length || cachedImages.has(images[img-1])) continue;
        const imageName = images[img - 1];
        promises.push(makeApiCallForImage(imageName).then(data => {
          cacheMap.set(imageName, data);
        }));
      }
      
      await Promise.all(promises);
      setCachedImages(cacheMap);
    } catch (error) {
      toast.error(error?.response?.data?.data?.message);
    }
  }

  useEffect(() => {
    if(images?.length > 0){
      if(!cachedImages.has(images[page-1])){
        getImageData(images[page-1])
      } else{
        const data = cachedImages.get(images[page-1])
        setClasses(data.parsedClasses)
        setCurrentImage(data.url)
        setImageLoader(false);
      }
      cacheImages(page)
    }
  }, [page, images])

  useEffect(() => {
    getModelData()
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
            {imageLoader ? (
              <div className="loading px-4 text-center" style={{width: canvasSize/2}}></div>
            ) : (
              <img
                src={cachedImageUrl || currentImage}
                style={{
                  maxWidth: canvasSize,
                  maxHeight: canvasSize
                }}
              />
            )}
          </div>
          <div className='font-medium text-lg'>Actual</div>
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
            {imageLoader ? (
              <div className="loading px-4 text-center" style={{width: canvasSize/2}}></div>
            ) : (
              <>
                {currentImage && (
                  <PredictedImage 
                    threshold={threshold} 
                    canvasSize={canvasSize} 
                    shapeProps={cachedClasses || classes} 
                    url={cachedImageUrl || currentImage} 
                  />
                )}
              </>
            )}
          </div>
          <div className='font-medium text-lg'>Prediction</div>
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
