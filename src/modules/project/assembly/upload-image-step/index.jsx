import axiosInstance from '@/core/request/aixosinstance';
import FileIcon from '@/shared/icons/FileIcon';
import Info from '@/shared/icons/Info';
import SpinLoader from '@/shared/icons/SpinLoader';
import Trash from '@/shared/icons/Trash';
import Upload from '@/shared/icons/Upload';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { selectedFileAtom, uploadedFileListAtom } from '../../state';

const UploadImagesStep = () => {
  const configurationId = useParams().configurationId;

  const [hover, setHover] = useState(-1);
  const [uploadLoader, setUploadLoader] = useState(new Map());
  const [images, setImages] = useState(new Map());
  const [deleteLoaders, setDeleteLoaders] = useState(new Map());

  const setSelectedFile = useSetRecoilState(selectedFileAtom);
  const setAllImages = useSetRecoilState(uploadedFileListAtom);

  const imageTypes = [
    {
      heading: 'One Master Image:',
      numberOfImages: 1,
      indices: [0],
      info: null,
    },
    {
      heading: 'Four Good Images:',
      numberOfImages: 4,
      indices: [1, 2, 3, 4],
      info: 'A good image is an image containing ALL the classes/objects needed for inspection',
    },
    {
      heading: 'Five Bad Images:',
      numberOfImages: 5,
      indices: [5, 6, 7, 8, 9],
      info: 'A bad image is an image containing NONE of the class/objects needed for inspection',
    },
  ];

  const setLoader = (idx, flag) => {
    setUploadLoader((prev) => {
      return new Map(prev).set(idx, flag);
    });
  };

  const validateImage = (fileList, index) => {
    const files = Array.from(fileList);
    if(imageTypes[index].indices.some(idx => images.has(idx))){
      const allowedLength = imageTypes[index].numberOfImages - imageTypes[index].indices.filter(idx => images.has(idx)).length;
      if(files.length > allowedLength){
        toast.error(
          `Please select only ${allowedLength} more PNG images`
        );
        return false;
      }
    }else if (files.length > imageTypes[index].numberOfImages) {
      toast.error(
        `Please select only ${imageTypes[index].numberOfImages} PNG image${index === 0 ? '' : 's'}`
      );
      return false;
    }

    const allFilesArePNG = files.every((file) => file.type === 'image/png');

    if (!allFilesArePNG) {
      toast.error('Please select only PNG images');
      return false;
    }

    return true;
  };

  const findIdleIndex = (indices, included) => {
    for (let i = 0; i < indices.length; i++) {
      if (!images.has(indices[i]) && !included.includes(indices[i])) {
        return indices[i];
      }
    }
    return null;
  };

  const hasIdleSlot = (indices) => {
    return indices.some((idx) => !images.has(idx));
  };

  const uploadImages = async (e, index) => {
    try {
      const canProceed = validateImage(e.target.files, index);
      if (!canProceed) return;

      const files = Array.from(e.target.files);
      setLoader(index, true);
      const included = [];
      for (const file of files) {
        const idleIndex = findIdleIndex(imageTypes[index].indices, included);
        included.push(idleIndex);
        if (idleIndex !== null) {
          await uploadImage(file, idleIndex);
        } else {
          toast.error('No idle slots available for this image type');
        }
      }
    } catch (error) {
      toast.error(error?.message || error?.response?.data?.data?.message);
    } finally {
      setLoader(index, false);
    }
  };

  const uploadImage = async (file, imgIndex) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('configurationId', configurationId);
      formData.append('index', imgIndex);
      await axiosInstance.post('/configuration/upload-base-image', formData);
      await fetchAllImages();
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.data?.message);
    }
  };

  const setDeleteLoading = (index, flag) => {
    setDeleteLoaders(prev => new Map(prev).set(index, flag));
  };

  const onChange = (file) => {
    setSelectedFile(file);
  };

  const removeImage = async (index) => {
    try {
      if (deleteLoaders.get(index) || !images.has(index)) return;
      const data = {
        id: images.get(index).id,
        configurationId,
      };
      setDeleteLoading(index, true);
      await axiosInstance.delete('/configuration/', {
        params: data,
      });
      await fetchAllImages();
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.data?.message);
    } finally {
      setDeleteLoading(index, false);
    }
  };

  const fetchAllImages = async (setAllLoaders = false) => {
    try {
      if(setAllLoaders){
        Array.from({ length: 3 }, () => '').forEach((_, i) => {
          setLoader(i, true);
        });
      }
      const response = await axiosInstance.get('/configurationImage/images', {
        params: {
          configurationId,
        },
      });

      const imagesResponse = response.data.data;
      const tempImages = new Map();
      imagesResponse.forEach((img) => {
        tempImages.set(img.index, {
          id: img.imageId,
          fileName: img.name,
          checked: false,
          number: img.index,
          url: `${import.meta.env.VITE_BASE_API_URL}/configurationImage/view?imageId=${img.imageId}`,
        });
      });
      if(tempImages.has(0)){
        onChange(tempImages.get(0));
      }
      setImages(tempImages);
    } catch (error) {
      console.log({error})
      // toast.error(error?.message || error?.response?.data?.data?.message);
    } finally {
      if(setAllLoaders){
        Array.from({ length: 3 }, () => '').forEach((_, i) => {
          setLoader(i, false);
        });
      }
    }
  };

  useEffect(() => {
    fetchAllImages(true);
  }, []);

  useEffect(() => {
    const requiredIndices = Array.from({ length: 10 }, (_, i) => i);
    const allImagesArray = Array.from({length: 10}, () => null);
    requiredIndices.forEach(imgIdx => {
      if(images.has(imgIdx)){
        allImagesArray[imgIdx] = images.get(imgIdx);
      }
    })
    setAllImages(allImagesArray);
  }, [images]);

  return (
    <div>
      <Toaster position="top-center" />
      <p>
        Upload one master image of perfectly good product for configuring
        inspection parameters. Additionally, upload four good images and five
        bad images evaluating project complexity.{' '}
      </p>

      <div className="mt-4 mb-10 flex flex-col gap-4">
        {imageTypes.map((image, index) => (
          <div className="my-1 flex flex-col gap-1" key={index}>
            <div className="relative flex items-center">
              <div className="m-2 text-lg font-bold">{image.heading}</div>
              {image.info && (
                <div
                  onMouseEnter={() => {
                    setHover(index);
                  }}
                  onMouseLeave={() => setHover(-1)}
                  className="relative my-2 cursor-pointer"
                >
                  <Info />
                  {hover === index && (
                    <span className="absolute bottom-full left-1/2 w-[280px] -translate-x-1/2 -translate-y-2 transform rounded-md bg-f-primary px-2 py-1 text-center text-sm text-white transition-opacity duration-300">
                      {image.info}
                    </span>
                  )}
                </div>
              )}
            </div>
            {hasIdleSlot(image.indices) && (
              <div className="mx-2 flex w-full flex-col items-center rounded-lg border-2 border-dashed border-indigo-600 bg-white py-5">
                {uploadLoader.get(index) ? (
                  <SpinLoader />
                ) : (
                  <label
                    htmlFor={`fileInput-${index}`}
                    className="flex cursor-pointer flex-col items-center"
                  >
                    <Upload color="#000" size={'24'} />
                    <p className="text-lg font-bold">
                      Browse Images{' '}
                      <span className="cursor-pointer font-bold text-indigo-600">
                        <u>here</u>
                      </span>
                    </p>
                    <div className="font-medium">PNG Images Only</div>
                    <input
                      id={`fileInput-${index}`}
                      className="hidden"
                      type="file"
                      accept=".png"
                      multiple
                      onChange={(e) => uploadImages(e, index)}
                    />
                  </label>
                )}
              </div>
            )}
            <div className="mx-2 flex w-full flex-col gap-2">
              {image.indices.map(
                (imgIdx) =>
                  images.has(imgIdx) && (
                    <div
                      className="flex items-center justify-between rounded-lg bg-f-light-gray p-3 text-f-dark-gray"
                      key={imgIdx}
                    >
                      <div className="flex items-center gap-2">
                        <FileIcon />
                        <div className="text-f-primary underline">
                          <a href={images.get(imgIdx).url} target="_blank">
                            {images.get(imgIdx).fileName}
                          </a>
                        </div>
                      </div>
                      {deleteLoaders.get(imgIdx) ? (
                        <SpinLoader
                          size='24'
                        />
                      ) : (
                        <span 
                          className="cursor-pointer"
                          onClick={() => removeImage(imgIdx)}
                        >
                          <Trash />
                        </span>
                      )}
                    </div>
                  )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadImagesStep;
