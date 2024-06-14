import axiosInstance from '@/core/request/aixosinstance';
import NoData from '@/shared/ui/NoData';
import ProjectCreateLoader from '@/shared/ui/ProjectCreateLoader';
import ResultPagination from '@/shared/ui/ResultPagination'
import Select from '@/shared/ui/Select';
import { removeDuplicates } from '@/util/util';
import React, { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'react-feather';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

const Evaluation = () => {
  const { modelId } = useParams();
  const [page, setPage] = useState(1);

  const [images, setImages] = useState(new Map());
  const [loaders, setLoaders] = useState(new Map());
  const [loading, setLoading] = useState(false);
  const [imagesList, setImagesList] = useState([]);
  const [classList, setClassList] = useState([]);
  const [classWithImageIds, setClassWithImageIds] = useState(new Map());
  const [classImages, setClassImages] = useState(new Map());
  const [selectedClass, setSelectedClass] = useState(null);
  const [imagePage, setImagePage] = useState(1);

  const total = classList?.length ? classWithImageIds?.get(classList[selectedClass])?.length : 0;

  const abortControllerRef = useRef();
  const currentClassWithImage = `${classList[selectedClass]}/${classWithImageIds.has(classList[selectedClass]) ? classWithImageIds.get(classList[selectedClass])[imagePage-1] : 0}`;

  const setLoader = (imageName, flag) => {
    setLoaders(prev => {
      const newLoaders = new Map(prev);
      newLoaders.set(imageName, flag);
      return newLoaders;
    })
  }

  const getImageByName = async (imageName) => {
    try {
      setLoader(imageName, true);
      const response = await axiosInstance.get('/model/evaluation-image', {
        params: {
          modelId,
          name: imageName
        },
        responseType: 'arraybuffer'
      });

      const blob = new Blob([response.data], { type: 'image/png' });
      const url = window.URL.createObjectURL(blob);
      setImages(prev => {
        const newImages = new Map(prev);
        newImages.set(imageName, url);
        return newImages;
      })
    } catch (error) {
      toast.error(error?.response?.data?.data?.message);
    } finally {
      setLoader(imageName, false);
    }
  }

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/model/result-images-list', {
        params: {
          modelId,
          mode: 'evaluation'
        }
      });

      setImagesList(response?.data?.data);
    } catch (error) {
      toast.error(error?.response?.data?.data?.message);
    } finally{
      setLoading(false);
    }
  }

  const fetchClassImageByName = async (className) => {
    try {
      if(abortControllerRef.current){
        abortControllerRef.current.abort();
      }
      setLoader(className, true);

      abortControllerRef.current = new AbortController();

      const response = await axiosInstance.get('/model/eval-class-images', {
        params: {
          modelId,
          name: className
        },
        signal: abortControllerRef.current.signal
      });
      setClassImages(response?.data?.images);
    } catch (error) {
      const isAborted = error?.config?.signal?.aborted;
      if(!isAborted)toast.error(error?.response?.data?.data?.message);
    } finally {
      setLoader(className, false);
    }
  }

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/model/result-images-list', {
        params: {
          modelId,
          mode: 'evalClasses'
        }
      });

      const classes = response?.data?.data;
      const classMap = new Map();
      classes.forEach(cl => {
        const [className, imageId] = cl.split('/');
        if(classMap.has(className)){
          classMap.set(className, [...classMap.get(className), imageId]);
        }else{
          classMap.set(className, [imageId]);
        }
      });
      setClassList(removeDuplicates(classes.map(cl => (cl.split('/')[0]))));
      setClassWithImageIds(classMap);
      setSelectedClass(0);
    } catch (error) {
      toast.error(error?.response?.data?.data?.message);
    } finally{
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchImages();
    fetchClasses();
  }, [])

  useEffect(() => {
    if (imagesList.length > 0) {
      imagesList.forEach(img => {
        getImageByName(img);
      })
    }
  }, [imagesList])

  useEffect(() => {
    if (classList.length > 0 && classWithImageIds.size > 0) {
      const classWithImageId = `${classList[selectedClass]}/${classWithImageIds.get(classList[selectedClass])[imagePage-1]}`
      fetchClassImageByName(classWithImageId)
    }
  }, [selectedClass, imagePage])

  if(!loading && imagesList.length == 0)return <NoData />;

  return (
    <div className='w-full'>
      {loading && <ProjectCreateLoader title='Loading Details' />}
      <h2 className='font-bold text-2xl my-2'>Prediction Results</h2>
      <div className="my-2 text-lg">
        The below images show the comparison of the ground truth with the predictions of the model.
        You can review it to see how accurate the model is currently in its predictions.
      </div>
      {loaders.get(imagesList[page - 1]) ? (
        <div className='flex items-center' style={{minHeight: '35vh'}}>
          <div className="loading mx-auto px-4 text-center bg-white" style={{ width: '10vw' }}></div>
        </div>
      ) : (
        <div className="mx-auto w-[35vw] h-[35vh] mb-4 mt-10">
          <img
            alt='evaluation-img'
            src={images.get(imagesList[page - 1])}
            style={{
              maxWidth: '35vw',
              maxHeight: '35vh',
              margin: '0 auto'
            }}
          />
        </div>
      )}
      <div className="mt-4 mb-10">
        <ResultPagination
          total={imagesList.length}
          page={page}
          setPage={setPage}
        />
      </div>
      <h2 className='font-bold text-2xl my-4'>Lime Results</h2>
      <div className="my-2 text-lg">
        The below images help you visualise what the model can see or not see in the evaluation data for each class.
        The ‘Main Clusters’ image shows what the model is allowed to see and not allowed to see.
        This is used to evaluate if the model can predict correctly in presence or absence of certain parts of the image data by deciding for itself if the input data is important or not.
        The ‘Heatmap’ image shows what the model decides is an important feature in the image and what is not important for correct predictions.
      </div>
      <div className="flex items-center justify-around gap-2 my-4 w-[80%] mx-auto">
        <div className=" max-w-2xl flex flex-col items-center">
          {loaders.get(currentClassWithImage) ? (
            <div className='flex items-center' style={{minHeight: '35vh'}}>
              <div className="loading mx-auto px-4 text-center bg-white" style={{ width: '10vw' }}></div>
            </div>
          ) : (
            <div className="mx-auto w-[20vw] mb-4 mt-10">
              <img
                alt='evaluation-img'
                src={classImages.length && `data:${classImages[0].type};base64,${classImages[0].base64}`}
                style={{
                  width: '20vw',
                  margin: '0 auto'
                }}
              />
            </div>
          )}
          <div className="my-2 text-lg font-bold">Heatmap</div>
        </div>

        <div className="max-w-2xl flex flex-col items-center">
          {loaders.get(currentClassWithImage) ? (
            <div className='flex items-center' style={{minHeight: '35vh'}}>
              <div className="loading mx-auto px-4 text-center bg-white" style={{ width: '10vw' }}></div>
            </div>
          ) : (
            <div className="mx-auto w-[20vw] mb-4 mt-10">
              <img
                alt='evaluation-img'
                src={classImages.length && `data:${classImages[1].type};base64,${classImages[1].base64}`}
                style={{
                  width: '20vw',
                  margin: '0 auto'
                }}
              />
            </div>
          )}
          <div className="my-2 text-lg font-bold">Main Clusters</div>
        </div>
      </div>
      {classWithImageIds.size > 0 && classWithImageIds.has(classList[selectedClass]) && (
        <div className="px-4 py-2 flex flex-col items-center mx-auto gap-4">
          <Select
            options={classList.map((cl, idx) => ({id: idx, name: cl}))}
            value={selectedClass}
            size='md'
            style={{
              textTransform: 'uppercase',
              backgroundColor: '#9990FF',
              color: '#fff',
              cursor: 'pointer'
            }}
            onChange={(e) => {
              const classIdx = Number(e.target.value);
              setImagePage(1);
              setSelectedClass(classIdx)
            }}
          />
          <ResultPagination
            total={total}
            page={imagePage}
            setPage={setImagePage}
          />
        </div>
      )}
    </div>
  )
}

export default Evaluation
