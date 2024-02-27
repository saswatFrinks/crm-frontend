import React from 'react';

export default function MatrixChart() {
  return (
    <div className="flex gap-4">
      <div>
        <div className="mb-1 text-center">Confusion matrix</div>
        <div className="grid h-80 w-80 grid-cols-2 grid-rows-2">
          <div className="flex h-40 w-40 items-center justify-center bg-[#08306b] text-xs text-white">
            175
          </div>
          <div className="flex h-40 w-40 items-center justify-center bg-[#ECEFF7] text-xs">
            200
          </div>
          <div className="flex h-40 w-40 items-center justify-center bg-[#ECEFF7] text-xs">
            123
          </div>
          <div className="flex h-40 w-40 items-center justify-center text-xs">
            0
          </div>
        </div>
      </div>
      <div className="flex">
        <div className="mt-6 w-8 bg-gradient-to-b from-[#08306b]">1</div>
        <div className="mt-6 flex w-8 flex-col justify-between">
          <span className="inline-flex ">
            - <span>8000</span>
          </span>
          <span className="inline-flex ">
            - <span>7000</span>
          </span>
          <span className="inline-flex ">
            - <span>6000</span>
          </span>
          <span className="inline-flex ">
            - <span>5000</span>
          </span>
          <span className="inline-flex ">
            - <span>4000</span>
          </span>
          <span className="inline-flex ">
            - <span>3000</span>
          </span>
          <span className="inline-flex ">
            - <span>2000</span>
          </span>
          <span className="inline-flex ">
            - <span>1000</span>
          </span>
          <span className="inline-flex ">
            - <span>0</span>
          </span>
        </div>
      </div>
    </div>
  );
}
