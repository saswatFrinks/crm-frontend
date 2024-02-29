import AnnotationClass from './AnnotationClass';

import Button from '@/shared/ui/Button';
import Pagination from '@/shared/ui/Pagination';
import AnnotationImage from './AnnotationImage';
import AnnotationLabels from './AnnotationLabels';
import Actions from './Actions';

export default function AnnotationJob() {
  const cancel = () => {};
  const submit = () => {};
  return (
    <div className="grid h-screen grid-cols-12">
      <div className="col-span-3 grid grid-rows-12 border-r-[1px] border-black">
        <div className="row-span-11  bg-white">
          <h1 className=" border-b-[1px] px-6 pb-6 pt-6 text-3xl font-bold">
            Annotation Job
          </h1>
          <div className="flex flex-col gap-4 p-4">
            <AnnotationClass />
            <AnnotationLabels />
          </div>
          <div className="border-t-[1px] border-black  py-4">
            <p className="text-center">10/100 Images Annotated</p>
            <Pagination />
          </div>
        </div>
        <div className="row-span-1 flex items-center gap-2 border-t-[1px] border-black bg-white px-6">
          <Button variant="flat" size="xs">
            Save & Exit
          </Button>
          <Button size="xs">Next</Button>
        </div>
      </div>
      <div className="col-span-9 grid grid-rows-12">
        <div className="row-span-11 flex flex-col items-center justify-center gap-4 bg-[#EAEDF1]">
          <AnnotationImage />
        </div>

        <div className="flex items-center justify-between border-t-[1px] border-gray-400 bg-white">
          <Actions cancel={cancel} submit={submit} />
        </div>
      </div>
    </div>
  );
}
