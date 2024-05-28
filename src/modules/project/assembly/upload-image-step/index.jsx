import React, { useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { selectedFileAtom, uploadedFileListAtom } from '../../state';
import X from '@/shared/icons/X';
import Upload from '@/shared/icons/Upload';
import { v4 as uuidv4 } from 'uuid';
import toast, { Toaster } from 'react-hot-toast';
import axiosInstance from '@/core/request/aixosinstance';
import { useParams } from 'react-router-dom';
import { imageTypes } from '@/core/constants';

export default function UploadImageStep() {
  const [images, setImages] = useRecoilState(uploadedFileListAtom);
  const configurationId = useParams().configurationId;
  
  const imagesWithTypes = {
    master: Array.from({ length: 1 }, () => ({ image: null })),
    good: Array.from({ length: 4 }, () => ({ image: null })),
    bad: Array.from({ length: 5 }, () => ({ image: null }))
  };
  const [imageLoader, setImageLoader] = React.useState(
    Array.from({length: 10}, () => false)
  );
  const [imageRemoveLoader, setImageRemoveLoader] = useState(
    Array.from({length: 10}, () => false)
  );

  const [selectedFiles, setSelectedFiles] = React.useState(
    Array.from({length: 10}, () => (null))
  );

  const setSelectedFile = useSetRecoilState(selectedFileAtom);

  const fetchAllImages = async () => {
    const response = await axiosInstance.get('/configurationImage/images', {
      params: {
        configurationId
      }
    });

    const imagesResponse = response.data.data;
    console.log("images:",images,imagesResponse)
    const tempImages = Array.from({length: 10}, () => null);
    console.log("tempImages:",tempImages)
    imagesResponse.map(img=>{
      tempImages[img.index]={
        id: img.imageId,
        fileName: `${img.imageId}.png`,
        checked: false,
        number: img.index,
        url: `${import.meta.env.VITE_BASE_API_URL}/configurationImage/view?imageId=${img.imageId}`
      };
    })
    if(tempImages[0]){
      onChange(tempImages[0])
    }
    console.log("images:",tempImages)
    setImages([...tempImages]);
  }

  useEffect(() => {
    fetchAllImages();
  }, []);

  const removeImage = async (index) => {
    try{
      if(imageLoader[index] || imageRemoveLoader[index])return;
      const data = {
        id: images[index].id,
        configurationId
      }
      setDeleteLoading(index, true);
      await axiosInstance.delete('/configuration/', {
        params: data
      });
      setSelectedFiles(prevFiles => {
        const newFiles = [...prevFiles];
        newFiles[index] = null;
        return newFiles;
      })
      await fetchAllImages();
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.data?.message)
    } finally {
      setDeleteLoading(index, false);
    }
  };

  const onChange = (file) => {
    setSelectedFile(file);
  };

  const getImageNumber = (index, typeIndex, type) => {
    switch(type){
      case 'master':
      case 'good':
        return index + typeIndex;
      case 'bad':
        return 3 + index + typeIndex;
      default:
        return 0;
    }
  }

  const setLoading = (index, flag) => {
    setImageLoader(loaders => {
      const newLoaders = [...loaders];
      newLoaders[index] = flag;
      return newLoaders;
    })
  }

  const setDeleteLoading = (index, flag) => {
    setImageRemoveLoader(loaders => {
      const newLoaders = [...loaders];
      newLoaders[index] = flag;
      return newLoaders;
    })
  }

  const handleChangeFile = (e, type, index, typeIndex) => {
    const fileList = e.target.files;
    const imageNum = getImageNumber(index, typeIndex, type);

    const files = Array.from(fileList);
    const allFilesArePNG = files.every((file) => file.type === 'image/png');
  
    if (!allFilesArePNG) {
      toast.error('Please select only PNG images');
      return;
    }
    
    setSelectedFiles(prev => {
      const temp = [...prev];
      temp[imageNum] = fileList[0];
      console.log("selectedFiles:",temp)
      return temp;
    });
  };

  const uploadImage = async (type, index, typeIndex) => {
    const imageNum = getImageNumber(index, typeIndex, type);
    try {
      if(!selectedFiles[imageNum] || imageLoader[imageNum] || imageRemoveLoader[imageNum])return;
      const formData = new FormData();
      formData.append('file', selectedFiles[imageNum]);
      formData.append('configurationId', configurationId);
      formData.append('index', imageNum);
      setLoading(imageNum, true);
      await axiosInstance.post('/configuration/upload-base-image', formData);
      await fetchAllImages();
      setLoading(imageNum, false);
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.data?.message)
      setLoading(imageNum, false);
    } 
  }

  return (
    <div>
      <Toaster position="top-center" />
      <p>
        Upload one master image of perfectly good product for configuring inspection parameters. 
        Additionally, upload four good images and five bad images evaluating project complexity.{' '}
      </p>

      <div className="mt-4 flex flex-col gap-4">
        {
          imageTypes.map((image, index) => {
            
            return <div className="my-1" key={index}>
              <div className="text-lg font-bold m-2">
                {image.label}
              </div>
              {imagesWithTypes[image.key].map((img, i) => {
                const imageNum = getImageNumber(index, i, image.key);
                return <div className="flex items-center gap-3 my-2" key={imageNum}>
                  {
                    images[imageNum] ? (
                      <div className='flex items-center gap-4'>
                        {i + 1}.
                        <a 
                          href={`${import.meta.env.VITE_BASE_API_URL}/configurationImage/view?imageId=${images[imageNum].id}`} 
                          target='_blank'
                        >
                          {images[imageNum]?.fileName}
                        </a>
                        {
                          imageRemoveLoader[imageNum] ? (
                            <div>Deleting...</div>
                          ) : (
                            <label onClick={() => {removeImage(imageNum)}}>
                              <X />
                            </label>
                          )
                        }
                      </div>
                    ) : (
                      <div>
                    <div className="flex items-center gap-3">
                      {i + 1}.
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-f-primary lg:px-10 sm:px-5 xs:px-1 py-2 text-white duration-100 hover:bg-f-secondary">
                        {selectedFiles[imageNum]?.name ? 'Change' : 'Choose'} Image
                        <input type="file" disabled={imageLoader[imageNum]} accept='.png' hidden onChange={(e) => {
                          handleChangeFile(e, image.key, index, i);
                        }}/>
                      </label>
                      {selectedFiles[imageNum] && <label 
                        className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-f-primary lg:px-10 sm:px-5 xs:px-1 py-2 text-white duration-100 hover:bg-f-secondary"
                        onClick={() => {
                          uploadImage(image.key, index, i);
                        }}
                      >
                        {
                          imageLoader[imageNum] ? (
                            <>Uploading...</>
                          ) : (
                            <>
                              <Upload /> Upload
                            </>
                          )
                        }
                      </label>}
                    </div>
                    {selectedFiles[imageNum]?.name && (
                      <div className="m-1 ml-7">
                        {selectedFiles[imageNum].name}
                      </div>
                    )}
                  </div>
                    )
                  }
                </div>
              })}
            </div>
          })
        }
      </div>
    </div>
  );
}
