import ResultPagination from '@/shared/ui/ResultPagination'
import React, { useState } from 'react'

const Evaluation = () => {
  const [page, setPage] = useState(1);
  const total = 10;

  return (
    <div className='w-full'>
      <h2 className='font-bold text-2xl my-2'>Prediction Results</h2>
      <div className="my-2 text-lg">
        The below images show the comparison of the ground truth with the predictions of the model.
        You can review it to see how accurate the model is currently in its predictions.
      </div>
      <div className="mx-auto w-[25vw] h-[30vh] mb-4 mt-10" style={{ border: '1px solid black' }}></div>
      <div className="mt-4 mb-10">
        <ResultPagination
          total={total}
          page={page}
          setPage={setPage}
        />
      </div>
      <h2 className='font-bold text-2xl my-4'>Lime Results</h2>
      <div className="my-2 text-lg">
        The below images help you visualise what the model can see or not see in the evaluation data.
        The ‘Main Clusters’ image shows what the model is allowed to see and not allowed to see.
        This is used to evaluate if the model can predict correctly in presence or absence of certain parts of the image data by deciding for itself if the input data is important or not.
        The ‘Heatmap’ image shows what the model decides is an important feature in the image and what is not important for correct predictions.
      </div>
      <div className="flex items-center justify-center gap-4 my-4">
        <div className="w-full max-w-2xl flex flex-col items-center">
          <div className="mx-auto w-[25vw] h-[30vh] my-4" style={{ border: '1px solid black' }}></div>
          <div className="my-2 text-lg font-bold">Main Clusters</div>
        </div>

        <div className="w-full max-w-2xl flex flex-col items-center">
          <div className="mx-auto w-[25vw] h-[30vh] my-4" style={{ border: '1px solid black' }}></div>
          <div className="my-2 text-lg font-bold">Heatmap</div>
        </div>
      </div>
    </div>
  )
}

export default Evaluation
