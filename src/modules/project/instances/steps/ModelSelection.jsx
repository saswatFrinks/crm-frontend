import { Accordion, AccordionBody, AccordionHeader } from '@material-tailwind/react'
import React, { useState } from 'react'

const ModelSelection = () => {
  const [open, setOpen] = useState(1);

  const handleOpen = (num) => {
    setOpen(open === num ? 0 : num);
  }

  function Icon({ open, id }) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className={`${id === open ? "rotate-180" : ""} h-5 w-5 transition-transform`}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-semibold">Model Selection</h1>
      <p className='my-4'>Select the trained AI-models to deploy in this instance</p>

      <Accordion open={open === 1} onClick={() => handleOpen(1)}>
        <AccordionHeader>
          <Icon open={open} id={1} /> What is Material Tailwind?
        </AccordionHeader>
        {open === 1 && <AccordionBody>
          We&apos;re not always in the position that we want to be at. We&apos;re constantly
          growing. We&apos;re constantly making mistakes. We&apos;re constantly trying to express
          ourselves and actualize our dreams.
        </AccordionBody>}
      </Accordion>
      {/* Repeat the same structure for other accordions */}
    </>
  )
}

export default ModelSelection
