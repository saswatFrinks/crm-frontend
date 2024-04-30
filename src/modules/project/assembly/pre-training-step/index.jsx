import { useState } from "react";
import { useRecoilValue } from "recoil";
import { annotationMapAtom, assemblyAtom, imageDimensionAtom, rectanglesAtom, uploadedFileListAtom } from "../../state";
import { cloneDeep } from "lodash";
import { RECTANGLE_TYPE } from "@/core/constants";
import axiosInstance from "@/core/request/aixosinstance";

export default function PreTrainingStep() {
  const columns = ['', 'Positive', 'Negative'];
  const configuration = useRecoilValue(assemblyAtom)
  const size = useRecoilValue(imageDimensionAtom)
  const rois = useRecoilValue(rectanglesAtom).filter((t)=>t.rectType==RECTANGLE_TYPE.ROI)
  const annotationRects = useRecoilValue(rectanglesAtom).filter((t)=>t.rectType==RECTANGLE_TYPE.ANNOTATION_LABEL)
  const images = useRecoilValue(uploadedFileListAtom)
  const annotationMap = useRecoilValue(annotationMapAtom)
  
  const prepareApiData = async()=>{
    const imgMap = {}
    const temp = cloneDeep(configuration)
    temp.direction = parseInt(temp.productFlow)
    delete temp.productFlow
    temp.rois = temp.rois.map((roi, index)=>{
      const tempParts = roi.parts.map((part)=>{
        return {
          classify: part.classify,
          class: part.class,
          name: part.objectName,
          count: part.qty,
          operator: part.operation
        }
      })
      let x1, x2, y1, y2
      rois.forEach((roiRect)=>{
        if(roi.id==roiRect.roiId){
          x1 = parseFloat((roiRect.x/size.width).toFixed(4))
          x2 = parseFloat(((roiRect.x+roiRect.width)/size.width).toFixed(4))
          y1 = parseFloat((roiRect.y/size.height).toFixed(4))
          y2 = parseFloat(((roiRect.y+roiRect.height)/size.height).toFixed(4))
        }
      })
      return {
        name: `ROI ${index}`,
        x1,
        x2,
        y1,
        y2,
        parts: tempParts
      }
    })
    if(temp.direction!=0){
      temp.rois[0].x1 = 0
      temp.rois[0].x2 = 1
      temp.rois[0].y1 = 0
      temp.rois[0].y2 = 1
      temp.rois[0].primaryObject = {
        name: temp.primaryObject,
        class: temp.primaryObjectClass,
      }
      delete temp.primaryObject
      delete temp.primaryObjectClass
    }
    const formData = new FormData();
    annotationRects.forEach((rect)=>{
      const classNo = annotationMap[rect.id]
      const height = (rect.height/size.height).toFixed(4)
      const width = (rect.width/size.width).toFixed(4)
      const x = ((rect.x+rect.width/2)/size.width).toFixed(4)
      const y = ((rect.y+rect.height/2)/size.height).toFixed(4)
      if(imgMap[rect.imageId]){
        imgMap[rect.imageId]+= `${classNo} ${x} ${y} ${width} ${height}\n`
      }else{
        imgMap[rect.imageId] = `${classNo} ${x} ${y} ${width} ${height}\n`
      }
    })
    await Promise.all(images.map(async(img, index)=>{
      const resp = await fetch(img.url)
      const blob = await resp.blob()
      const fileContents = imgMap[img.id] || ""
      const fileBlob = new Blob([fileContents], { type: 'text/plain' })
      formData.append('images', blob, img.name)
      formData.append('files', fileBlob, img.id)
    }))
    formData.append('data', JSON.stringify(temp))
    formData.append('configurationId', temp.id)
    formData.append('isGood', JSON.stringify([true, true, false, false, false, true, false, true, true, false]))
    console.log(formData.get('data'))
    const data = await axiosInstance.post("/configuration/assembly", formData)
    console.log(data)
  }

  useState(()=>{
    prepareApiData()
  }, [])

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
