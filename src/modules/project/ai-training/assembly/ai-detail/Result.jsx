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
import Select from '@/shared/ui/Select';

export default function Result() {
  const canvasSize = 500;
  const params = useParams();
  const [threshold, setThreshold] = useState(0.5);
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [imageWithConfigs, setImageWithConfigs] = useState([]);
  const [roiImageMap, setRoiImageMap] = useState(new Map());
  const [selectedImage, setSelectedImage] = useState(0);
  const [datasetCount, setDatasetCount] = useState(0);

  const [cachedImages, setCachedImages] = useState(new Map());

  const [loader, setLoader] = useState(true);
  const [imageLoader, setImageLoader] = useState(false);
  const [imageLoader2, setImageLoader2] = useState(false);

  const cacheAbortControllerRef = Array.from({ length: 5 }, () => useRef(null));

  const currentImg = roiImageMap?.has(images[selectedImage]) ? roiImageMap?.get(images[selectedImage])[page - 1] : '';

  const getFormattedBoxes = (boxes) => {
    return boxes.map((classItem, index) => ({
      ...classItem,
      x: (classItem.x1 + classItem.x2) / 2,
      y: (classItem.y1 + classItem.y2) / 2,
      width: Math.abs(classItem.x1 - classItem.x2),
      height: Math.abs(classItem.y1 - classItem.y2),
      id: index,
      title: `Class ${index + 1}`,
    }))
  }

  const makeApiCallForImage = async (imageName, roiId, signal, pageNum = null) => {
    let index;
    try {
      const config = {
        params: {
          modelId: params.modelId,
          name: imageName?.split('_')[0],
          roiId
        },
        responseType: 'arraybuffer',
      };

      if (signal) {
        config.signal = signal;
      }
      if (pageNum !== null) {
        if (imageLoader === false) {
          index = 0;
          setImageLoader(true);
        } else if (imageLoader2 === false) {
          index = 1;
          setImageLoader2(true);
        }
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
    } catch (error) {
      const isAborted = error?.config?.signal?.aborted;
      if (!isAborted) toast.error(error?.response?.data?.data?.message);
    } finally {
      if (index === 0) {
        setImageLoader(false);
      } else if (index === 1) {
        setImageLoader2(false);
      }
    }
  }

  const getDatasetCount = async () => {
    try{
      const response = await axiosInstance.get('/model/model-data', {
        params: {
          modelId: params.modelId,
        }
      });
      setDatasetCount(response.data?.data?.datasets.reduce((prev, cur)=> prev + cur.annotatedImages, 0));
    }
    catch(e){}
  }

  const getModelData = async () => {
    try {
      setLoader(true);
      const response = await axiosInstance.get('/model/result-images-list', {
        params: {
          modelId: params.modelId,
          mode: 'validation'
        }
      });

      const imageList = response?.data?.data;
      setImageWithConfigs(imageList);
      const keys = [];
      const imageRoiMap = new Map();
      imageList.forEach(img => {
        const imgArray = img.split('/');
        const key = `${imgArray[0]}-${imgArray[1]}-${imgArray[2]}`;
        if (!keys.includes(key)) keys.push(key)
        if (imageRoiMap.has(key)) {
          imageRoiMap.set(key, [...imageRoiMap.get(key), `${imgArray[3]}/${imgArray[4]}`]);
        } else {
          imageRoiMap.set(key, [`${imgArray[3]}/${imgArray[4]}`]);
        }
      })
      setImages(keys);
      setRoiImageMap(imageRoiMap);
      setSelectedImage(0);
      getDatasetCount();
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
    if (imageCache.has(imageName) && imageCache.get(imageName)?.url) {
      URL.revokeObjectURL(imageCache.get(imageName)?.url);
      imageCache.delete(imageName);
    }
  }

  const deleteOlderCaches = (pageNum) => {
    const persistRange = [pageNum - 4, pageNum - 3, pageNum + 3, pageNum + 4];
    let cacheAfterDelete = new Map(cachedImages);

    const actualIndex = imageWithConfigs.findIndex(conf => conf.startsWith(images[selectedImage].split('-').join('/')));

    persistRange.forEach(index => {
      const idx = actualIndex + (index - 1);
      if (idx > 0 && idx < (imageWithConfigs.length - 1) && cacheAfterDelete.size > 10) {
        const name = `${imageWithConfigs[idx].split('/')[3]}/${imageWithConfigs[idx].split('/')[4]}`
        deleteBlob(name, cacheAfterDelete);
      }
    })
    setCachedImages(cacheAfterDelete);
    return cacheAfterDelete;
  }

  const cacheImages = async (selectedImage, pageNum) => {
    try {
      const cacheAfterDelete = deleteOlderCaches(pageNum);
      const cacheMap = new Map(cacheAfterDelete);
      const promises = [];
      const configImages = roiImageMap.get(images[selectedImage]) ?? [];

      cacheAbortControllerRef.forEach(r => {
        if (r.current) {
          r.current.abort();
        }
      })

      for (let img = pageNum - 2; img <= pageNum + 2; img++) {
        let idx = img - (pageNum - 2);
        cacheAbortControllerRef[idx].current = new AbortController();
        const { signal } = cacheAbortControllerRef[idx].current;
        let isUrlValid = false;
        if (cacheMap.has(configImages[img - 1])) {
          isUrlValid = await checkBlobURLValidity(cacheMap.get(configImages[img - 1])?.url);
        }
        if (img <= 0 || img > configImages.length || isUrlValid) continue;
        const imageName = configImages[img - 1];
        if (img === pageNum && !isUrlValid) {
          const data = await makeApiCallForImage(imageName.split('/')[1], imageName.split('/')[0], signal, pageNum);
          if (!(signal.aborted)) {
            cacheMap.set(imageName, data);
            setCachedImages(cacheMap);
          }
        } else {
          promises.push(makeApiCallForImage(imageName.split('/')[1], imageName.split('/')[0], signal).then(data => {
            if (!(signal.aborted)) {
              cacheMap.set(imageName, data);
              setCachedImages(cacheMap);
            }
          }));
        }
      }

      await Promise.all(promises);
    } catch (error) {
      const isAborted = error?.config?.signal?.aborted;
      if (!isAborted) toast.error(error?.response?.data?.data?.message);
    }
  }

  function distributeCounts(x) {
    let testingData = 0.2 * x;
    let validationData = 0.2 * 0.8 * x;
    let trainingData = 0.8 * 0.8 * x;

    let roundedTestingData = Math.round(testingData);
    let roundedValidationData = Math.round(validationData);
    let roundedTrainingData = Math.round(trainingData);

    console.log({trainingData, validationData, testingData, roundedTestingData, roundedValidationData, roundedTrainingData})

    let total = roundedTestingData + roundedValidationData + roundedTrainingData;

    let difference = x - total;

    if (difference !== 0) {
      let  fractions = [
        { value: testingData, rounded: roundedTestingData, key: 'testing' },
        { value: validationData, rounded: roundedValidationData, key: 'validation' },
        { value: trainingData, rounded: roundedTrainingData, key: 'training' }
      ];
      if (difference > 0) {
        fractions.sort((a, b) => (b.value % 1) - (a.value % 1));
        for (let i = 0; i < difference; i++) {
          fractions[i].rounded += 1;
        }
      } else {
        fractions.sort((a, b) => (a.value % 1) - (b.value % 1));
        for (let i = 0; i < Math.abs(difference); i++) {
          fractions[i].rounded -= 1;
        }
      }
      roundedTestingData = fractions.find(fr => fr.key === 'testing').rounded;
      roundedValidationData = fractions.find(fr => fr.key === 'validation').rounded;
      roundedTrainingData = fractions.find(fr => fr.key === 'training').rounded;
    }

    return {
      testingCount: roundedTestingData,
      validationCount: roundedValidationData,
      trainingCount: roundedTrainingData
    };
  }

  const {trainingCount, testingCount, validationCount} = distributeCounts(datasetCount);

  useEffect(() => {
    if (images?.length > 0) {
      const imageName = roiImageMap.has(images[selectedImage]) ? roiImageMap.get(images[selectedImage])[page - 1] : ''
      const data = cachedImages.get(imageName)
      if (data) {
        checkBlobURLValidity(data.url).then(isValid => {
          if (isValid) {
            setImageLoader(false);
            setImageLoader2(false);
          } else {
            setCachedImages(prev => {
              prev.delete(imageName);
              return prev;
            })
          }
        });
      }
      cacheImages(selectedImage, page);
    }
  }, [page, images, selectedImage])

  useEffect(() => {
    getModelData()

    return () => {
      cachedImages.forEach((value, key) => {
        if (value) URL.revokeObjectURL(value.url);
      });
      setCachedImages(new Map());
    }
  }, [])

  return (
    <div className="grid gap-4">
      {loader && <ProjectCreateLoader title='Fetching Images' />}
      <ul className="flex gap-12">
        <li>Training Data: {trainingCount} images</li>

        <li>Testing Data: {testingCount} images</li>

        <li>Validation Data: {validationCount} images</li>
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
              <div className="loading px-4 text-center" style={{ width: canvasSize / 2 }}></div>
            ) : (
              <img
                src={cachedImages.get(currentImg)?.url}
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
              <div className="loading px-4 text-center" style={{ width: canvasSize / 2 }}></div>
            ) : (
              <>
                {(cachedImages.get(currentImg)?.url) && (
                  <PredictedImage
                    threshold={threshold}
                    canvasSize={canvasSize}
                    shapeProps={cachedImages.get(currentImg)?.parsedClasses}
                    url={cachedImages.get(currentImg)?.url}
                  />
                )}
              </>
            )}
          </div>
          <div className='font-medium text-xl'>Prediction</div>
        </div>
      </div>

      {images.length > 0 && <Select
        value={selectedImage}
        options={images.map((img, idx) => ({ id: idx, name: img }))}
        onChange={(e) => {
          setSelectedImage(Number(e.target.value))
          setPage(1)
        }}
        size='md'
        style={{
          backgroundColor: '#9990FF',
          color: '#fff',
          cursor: 'pointer'
        }}
      />}
      <ResultPagination page={page} setPage={setPage} total={roiImageMap.has(images[selectedImage]) ? roiImageMap.get(images[selectedImage])?.length : 0} />

      <div className="flex flex-col items-center gap-4">
        <Slider title={'Confidence Threshold:'} id="confidence" value={threshold} setValue={setThreshold} />
        {/* <Slider title={'IOU Threshold:'} id="iou" /> */}
      </div>

      <h3 className="text-2xl font-semibold">Training Results</h3>

      <p>
        The below graphs helps you visualise the training results. You can
        understand the false positive and false negative of the trained model
        from the <a href='https://developers.google.com/machine-learning/glossary#confusion_matrix' target='__blank'><span className='text-[#6B4EFF] font-bold underline'>confusion matrix</span></a>.
        And the <a href='https://developers.google.com/machine-learning/crash-course/classification/precision-and-recall' target='__blank'><span className='text-[#6B4EFF] font-bold underline'>precision-recall</span></a> curve helps you
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
