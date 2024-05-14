import axiosInstance from '@/core/request/aixosinstance';
import Box from '@/shared/icons/Box';
import { getRandomHexColor } from '@/util/util';
import React from 'react';
import { useParams } from 'react-router-dom';

export default function AnnotationClass() {
  const {projectId} = useParams();
  const [labelClass, setLabelClass] = React.useState([]);
  const getClasses = async() => {
    try {
      const classes = await axiosInstance.get("/class/list", {
        params: {
          projectId
        }
      })
      setLabelClass(classes.data.data.map(cls=>({...cls, color: getRandomHexColor()})))
    } catch (error) {
      
    }
  }

  React.useEffect(()=>{
    getClasses();
  }, [])

  console.log(labelClass)

  return (
    <div className="">
      <p className="mb-4">Click the class below to label it</p>
      <ul className="flex flex-wrap gap-4">
        {labelClass.map((t) => (
          <li
            key={t.color}
            className={`bg-[${t.color}] flex cursor-pointer items-center gap-1 rounded-md px-3 py-1.5`}
            style={{backgroundColor: t.color}}
          >
            <Box size="xs" />
            {t.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
