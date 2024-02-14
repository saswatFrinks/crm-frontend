import ArrowRight from '@/shared/icons/ArrowRight';
import Heading from '@/shared/layouts/main/heading';
import { modalAtom } from '@/shared/states/modal.state';
import Modal from '@/shared/ui/Modal';
import { useSetRecoilState } from 'recoil';
import Variant from '../variants/Variant';
import AddCameraPositionModal from './AddCameraPositionModal';
import { Link, useParams } from 'react-router-dom';

export default function CameraPosition() {
  const setModalState = useSetRecoilState(modalAtom);
  const params = useParams();

  return (
    <>
      <Modal>
        <AddCameraPositionModal />
      </Modal>

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
          </>
        }
      >
        Project
      </Heading>

      <div className="p-10">
        <h1 className="text-2xl font-semibold">Camera Position</h1>
        <div className="mt-10 flex flex-wrap gap-6">
          <Variant.Create
            onClick={() => setModalState(true)}
            title="Add Camera Position"
          />

          {Array(5)
            .fill(1)
            .map((t, i) => (
              <Variant.Card
                key={i}
                title="Camera Position"
                to={'camera-position/123'}
              />
            ))}
        </div>
      </div>
    </>
  );
}
