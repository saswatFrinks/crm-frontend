import BigImage from '@/shared/icons/BigImage';
import React, { useEffect, useState } from 'react';
import useImage from 'use-image';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  assemblyAtom,
  cachedFileListAtom,
  currentRoiIdAtom,
  imageStatusAtom,
  labelClassAtom,
  rectanglesAtom,
  polygonsAtom,
  rectanglesTypeAtom,
  polygonsTypeAtom,
  selectedFileAtom,
  uploadedFileListAtom,
} from '../../state';
import { stepAtom } from '../state';
import { RECTANGLE_TYPE } from '@/core/constants';
import KonvaImageView from './KonvaImageView';
import toast from 'react-hot-toast';
import axiosInstance from '@/core/request/aixosinstance';

export default function UploadImage({type=null}) {
  const [file, setFile] = React.useState(null);
  const [imageLoading, setImageLoading] = useState(
    Array.from({ length: 10 }, () => false)
  );

  const [rectangles, setRectangles] = useRecoilState(rectanglesAtom);
  const [polygons, setPolygons] = useRecoilState(polygonsAtom)

  const step = useRecoilValue(stepAtom);

  const [selectedFile, setSelectedFile] = useRecoilState(selectedFileAtom);

  const [uploadedFileList, setUploadedFileList] =
    useRecoilState(uploadedFileListAtom);

  const [cachedFileList, setCachedFileList] =
    useRecoilState(cachedFileListAtom);

  const [image] = useImage(file);

  const [configuration, setConfiguration] = useRecoilState(assemblyAtom);
  const selectedRoiId = useRecoilValue(currentRoiIdAtom);
  const seletectedLabel = useRecoilValue(labelClassAtom);
  const setRectType = useSetRecoilState(rectanglesTypeAtom);
  const setPolyType = useSetRecoilState(polygonsTypeAtom);

  const [imageStatus, setImageStatus] = useRecoilState(imageStatusAtom);
  const [polyDraw, setPolyDraw] = useState(false);

  const roiIndex = configuration?.rois?.findIndex((v) => v.id == selectedRoiId);
  const name = configuration?.rois?.filter((v) => v.id == selectedRoiId)[0]?.title;
  const roiName =
    roiIndex >= 0
      // ? `ROI ${roiIndex}`
      ? name ?? `ROI ${roiIndex}`
      : seletectedLabel
        ? seletectedLabel.name
         // ? `${seletectedLabel.name}
          //  ${
          //     1 +
          //     rectangles.reduce((p, c) => {
          //       return c.rectType == RECTANGLE_TYPE.ANNOTATION_LABEL &&
          //         c.imageId == selectedFile?.id
          //         ? p + 1
          //         : p;
          //     }, 0)
          // }`
        :  undefined;

  const selectedIndex = uploadedFileList.findIndex(
    (f) => f && f?.id === selectedFile?.id
  );

  const cacheImages = async () => {
    try {
      if (uploadedFileList.some((uploadedFile) => !uploadedFile)) return;
      setImageLoading(Array.from({ length: 10 }, () => true));
      let cacheMap = [...uploadedFileList];
      let flag = false;
      for (let i = 0; i < uploadedFileList.length; i++) {
        const imageId = uploadedFileList[i]?.id;
        if (uploadedFileList.some((uploadedFile) => !uploadedFile)) return;
        if (!imageId) {
          setImageLoading((prev) => {
            prev[i] = false;
            return prev;
          });
          continue;
        }
        const config = {
          params: {
            imageId,
          },
          responseType: 'arraybuffer',
        };
        const isExists = cacheMap.find((img) => img && img.id === imageId);
        if (isExists && uploadedFileList[i]?.url?.startsWith('blob')) {
          setImageLoading((prev) => {
            prev[i] = false;
            return prev;
          });
          continue;
        }
        flag = true;
        console.log('called');

        const res = await axiosInstance.get('/configurationImage/view', config);
        const blob = new Blob([res.data], { type: 'image/png' });
        const url = window.URL.createObjectURL(blob);
        cacheMap = cacheMap.map((item, index) =>
          index === i ? { ...uploadedFileList[index], url } : item
        );
        if (flag && imageId === selectedFile?.id) {
          setSelectedFile({
            ...uploadedFileList[i],
            url,
          });
        }
        setImageLoading((prev) => {
          prev[i] = false;
          return prev;
        });
        if (uploadedFileList.some((uploadedFile) => !uploadedFile)) return;
        setCachedFileList(cacheMap);
      }

      setCachedFileList(cacheMap);
    } catch (error) {
      console.log({ error });
      if (error?.response?.status != 400) {
        toast.error(error?.response?.data?.data?.message);
      }
      setImageLoading(Array.from({ length: 10 }, () => false));
    }
  };

  React.useEffect(() => {
    if (selectedFile?.url) {
      setFile(selectedFile?.url);
    }
  }, [selectedFile?.id, selectedFile]);

  const updateRectangles = (rects) => {
    setRectangles(rects);
  };

  const updatePolygons = (polys) => {
    setPolygons(polys)
  }

  useEffect(() => {
    if(imageStatus.drawMode === 'POLY') {
      setPolyDraw(true)
    } else if(imageStatus.drawMode == false){
      setPolyDraw(false);
    }
  }, [imageStatus.drawMode])

  // const updatePolygon = (polys) => {
  //   setPolygon(polys);
  // }

  React.useEffect(() => {
    setRectType(RECTANGLE_TYPE.ROI);
    setPolyType(RECTANGLE_TYPE.ROI);
  }, []);

  React.useEffect(() => {
    cacheImages();
  }, [uploadedFileList]);

  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-4"
      style={{
        width: ((window.innerWidth - 16 * 4) * 7) / 12,
        maxHeight: '91.65vh',
      }}
    >
      {step == 0 ? (
        <>
          <BigImage />
          <label className="px-20 py-2 text-xl">
            Upload images to get started with the configuration
          </label>
        </>
      ) : null}

      {selectedIndex > -1 && imageLoading[selectedIndex] && step !== 0 ? (
        <div className="flex h-full w-[30%] flex-col items-center justify-center gap-4">
          <div className="text-xl font-medium">Loading Image</div>
          <div className="loading px-4 text-center"></div>
        </div>
      ) : (
        <>
          {file && [1, 2, 3].includes(step) && image?.width ? (
            <KonvaImageView
              image={image}
              onDrawStop={updateRectangles}
              rectangles={rectangles}
              title={roiName}
              imageId={selectedFile?.id}
              polygons={polygons}
              onPolyUpdate={updatePolygons}
              polyDraw={polyDraw}
              page='configuration'
              type={type}
            />
          ) : null}
        </>
      )}
    </div>
  );
}
