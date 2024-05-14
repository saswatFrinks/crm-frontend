import { Accordion, AccordionBody, AccordionHeader } from '@material-tailwind/react'
import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil';
import { addInstanceAtom } from '../state';
import { removeDuplicates } from '@/util/util';

const ModelSelection = () => {
  const [open, setOpen] = useState([]);
  const [addInstance, setAddInstance] = useRecoilState(addInstanceAtom);
  const [classColors, setClassColors] = useState(new Map());
  const data = addInstance?.mappingData;

  const handleOpen = (num) => {
    setOpen(open === num ? 0 : num);
  }

  const filterClasses = () => {
    const classes = new Map();
    let classesData = [];
    addInstance?.mappingData?.forEach(data => {
      classesData = [...classesData, ...data?.classes]
    });

    const uniqueClasses = removeDuplicates(classesData);
    uniqueClasses.forEach((data, i) => {
      classes.set(data?.id, `color-${(i%10)+1}`)
    })

    setClassColors(classes);
  }

  useEffect(() => {
    filterClasses()
  }, [])

  useEffect(() => {
    setOpen(Array.from({length: data?.length}, () => true));
  }, [data])

  function Icon({ open }) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className={`${open ? "rotate-180" : ""} h-5 w-5 transition-transform`}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
    );
  }

  const keys = ['variantName', 'capturePositionName', 'cameraConfigName', 'roiName'];

  return (
    <>
      <h1 className="text-2xl font-semibold">Model Selection</h1>
      <p className='my-4'>Select the trained AI-models to deploy in this instance</p>

      {data?.map(
        (modelData, index) => (
          <Accordion open={open[index]} onClick={() => handleOpen(index)}>
            <AccordionHeader>
              <div className="mr-2">
                <Icon open={open[index]} />
              </div>
              <div className="flex justify-between gap-4" style={{width: '100%'}}>
                {keys.map(key => (
                  <div>{modelData[key]}</div>
                ))}
              </div>
            </AccordionHeader>
            {open[index] && 
              (
                <AccordionBody>
                  We&apos;re not always in the position that we want to be at. We&apos;re constantly
                  growing. We&apos;re constantly making mistakes. We&apos;re constantly trying to express
                  ourselves and actualize our dreams.
                </AccordionBody>
              )}
          </Accordion>
        )
      )}
    </>
  )
}

export default ModelSelection
