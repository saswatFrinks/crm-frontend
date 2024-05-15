// import { useState } from "react";
// import { useRecoilValue } from "recoil";
// import { annotationMapAtom, assemblyAtom, imageDimensionAtom, rectanglesAtom, uploadedFileListAtom } from "../../state";
// import { cloneDeep } from "lodash";
// import { RECTANGLE_TYPE } from "@/core/constants";
// import axiosInstance from "@/core/request/aixosinstance";

import axiosInstance from '@/core/request/aixosinstance';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

export default function PreTrainingStep() {
  const columns = ['', 'Positive', 'Negative'];
  const [loader, setLoader] = useState(false);
  const params = useParams();
  // const configuration = useRecoilValue(assemblyAtom)
  // const rois = useRecoilValue(rectanglesAtom).filter((t)=>t.rectType==RECTANGLE_TYPE.ROI)
  // const annotationRects = useRecoilValue(rectanglesAtom).filter((t)=>t.rectType==RECTANGLE_TYPE.ANNOTATION_LABEL)
  // const images = useRecoilValue(uploadedFileListAtom)
  // const annotationMap = useRecoilValue(annotationMapAtom)

  // const prepareApiData = async()=>{
  //   const imgMap = {}
  //   const temp = cloneDeep(configuration)
  //   temp.direction = parseInt(temp.productFlow)
  //   delete temp.productFlow
  //   temp.rois = temp.rois.map((roi, index)=>{
  //     const tempParts = roi.parts.map((part)=>{
  //       return {
  //         classify: part.classify=='on',
  //         class: part.class,
  //         name: part.objectName,
  //         count: part.qty,
  //         operator: part.operation
  //       }
  //     })
  //     let x, width, y, height
  //     console.log(roi.id, rois.map(ele=>ele.roiId))
  //     rois.forEach((roiRect)=>{
  //       if(roi.id==roiRect.roiId){
  //         x = parseFloat((roiRect.x).toFixed(4))
  //         width = parseFloat((roiRect.width).toFixed(4))
  //         y = parseFloat((roiRect.y).toFixed(4))
  //         height = parseFloat((roiRect.height).toFixed(4))
  //       }
  //     })
  //     return {
  //       name: `ROI ${index}`,
  //       x,
  //       width,
  //       y,
  //       height,
  //       parts: tempParts
  //     }
  //   })
  //   if(temp.direction!=0){
  //     temp.rois[0].primaryObject = {
  //       name: temp.primaryObject,
  //       class: temp.primaryObjectClass,
  //     }
  //   }
  //   delete temp.primaryObject
  //   delete temp.primaryObjectClass
  //   const formData = new FormData();
  //   annotationRects.forEach((rect)=>{
  //     const classNo = annotationMap[rect.id]
  //     const height = (rect.height).toFixed(4)
  //     const width = (rect.width).toFixed(4)
  //     const x = (rect.x).toFixed(4)
  //     const y = (rect.y).toFixed(4)
  //     if(imgMap[rect.imageId]){
  //       imgMap[rect.imageId]+= `${classNo} ${x} ${y} ${width} ${height}\n`
  //     }else{
  //       imgMap[rect.imageId] = `${classNo} ${x} ${y} ${width} ${height}\n`
  //     }
  //   })
  //   await Promise.all(images.map(async(img, index)=>{
  //     const resp = await fetch(img.url)
  //     const blob = await resp.blob()
  //     const fileContents = imgMap[img.id] || ""
  //     const fileBlob = new Blob([fileContents], { type: 'text/plain' })
  //     formData.append('images', blob, img.name)
  //     formData.append('files', fileBlob, img.id)
  //   }))
  //   formData.append('data', JSON.stringify(temp))
  //   formData.append('configurationId', temp.id)
  //   formData.append('isGood', JSON.stringify([true, true, true, true, true, false, false, false, false, false]))
  //   console.log(formData.get('data'))
  //   const data = await axiosInstance.post("/configuration/assembly", formData)
  //   console.log(data)
  // }

  // useState(()=>{
  //   prepareApiData()
  // }, [])

  const helper = async () => {
    setLoader(true);
    try {
      console.log('params:', params);
      await axiosInstance.get('/recommender/start', {
        params: {
          configId: params.configurationId,
        },
      });
    } catch (e) {
      console.error('Error in pre training helper:', e);
      toast.error(e);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    helper();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-center text-2xl font-semibold">
        Your project is configured!{' '}
      </h3>
      <p className="text-center text-lg">
        Below are the data recommendations for good training results
      </p>

      <table className="w-full text-left text-sm text-gray-500 rtl:text-right ">
        <thead className="bg-white text-sm uppercase text-gray-700 ">
          <tr>
            {columns.map((t) => (
              <th scope="col" className="px-6 py-3" key={t}>
                {t}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array(4)
            .fill(1)
            .map((plant, index) => {
              return (
                <tr
                  className="border-b odd:bg-white even:bg-[#C6C4FF]/10"
                  key={index}
                >
                  <th
                    scope="row"
                    className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 "
                  >
                    Overall
                  </th>
                  <td className="px-6 py-4">200</td>
                  <td className="px-6 py-4">156</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
