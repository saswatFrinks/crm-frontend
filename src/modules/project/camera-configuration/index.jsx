import ArrowRight from '@/shared/icons/ArrowRight';
import Heading from '@/shared/layouts/main/heading';
import { modalAtom } from '@/shared/states/modal.state';
import { useSetRecoilState } from 'recoil';
import Variant from '../variants/Variant';
import React from 'react';
import Drawer from '@/shared/ui/Drawer';
import Button from '@/shared/ui/Button';
import AddCameraConfigurationDrawer from './AddCameraConfigurationDrawer';
import { useFormik } from 'formik';

export default function CameraConfiguration() {
  const [open, setOpenDrawer] = React.useState(false);
  const ref = React.useRef(null);

  const closeDrawer = () => {
    setOpenDrawer(false);
  };

  const openDrawer = () => {
    setOpenDrawer(true);
  };

  return (
    <>
      <Heading
        subcontent={
          <>
            <ArrowRight />
            <span>Project Name</span>
            <ArrowRight />
            <span>Variant Name</span>
            <ArrowRight />
            <span>Camera Position</span>
          </>
        }
      >
        Project
      </Heading>

      <div className="p-10">
        <h1 className="text-2xl font-semibold">Camera Configuration</h1>
        <div className="mt-10 flex flex-wrap gap-6">
          <Variant.Create
            onClick={openDrawer}
            title="Add Camera Configuration"
          />

          {Array(5)
            .fill(1)
            .map((t, i) => (
              <Variant.Card
                key={i}
                title="Camera Config"
                to={'camera-config/123'}
              />
            ))}
        </div>
      </div>

      <Drawer
        isOpen={open}
        handleClose={closeDrawer}
        title={'Add camera configuration'}
        size="xs"
        footer={
          <div className="flex  items-end justify-end gap-4 ">
            <Button
              size="xs"
              color="flat"
              fullWidth={false}
              className="min-w-[150px]"
              onClick={closeDrawer}
            >
              Cancel
            </Button>
            <Button
              size="xs"
              fullWidth={false}
              className="min-w-[150px]"
              onClick={ref.current?.submitForm()}
            >
              Confirm
            </Button>
          </div>
        }
      >
        <AddCameraConfigurationDrawer ref={ref} closeDrawer={closeDrawer} />
      </Drawer>
    </>
  );
}
