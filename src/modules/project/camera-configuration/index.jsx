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
import { Link, useParams } from 'react-router-dom';

export default function CameraConfiguration() {
  const [open, setOpenDrawer] = React.useState(false);

  const params = useParams();

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
            <Link
              to={`/project/${params.projectId}`}
              className="flex items-center gap-2"
            >
              <ArrowRight />
              <span>Project Name</span>
            </Link>
            <Link
              to={`/project/${params.projectId}/variant/${params.variantId}`}
              className="flex items-center gap-2"
            >
              <ArrowRight />
              <span>Variant Name</span>
            </Link>

            <Link
              to={`/project/${params.projectId}/variant/${params.variantId}/camera-position/${params.cameraPositionId}`}
              className="flex items-center gap-2"
            >
              <ArrowRight />
              <span>Camera Position</span>
            </Link>
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
              variant="flat"
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
              onClick={() => ref.current?.submitForm()}
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
