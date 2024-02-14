import ArrowRight from '@/shared/icons/ArrowRight';
import Heading from '@/shared/layouts/main/heading';
import { modalAtom } from '@/shared/states/modal.state';
import Modal from '@/shared/ui/Modal';
import { useSetRecoilState } from 'recoil';
import Variant from '../variants/Variant';
import AddCameraPositionModal from './AddCameraPositionModal';

export default function CameraPosition() {
  const setModalState = useSetRecoilState(modalAtom);

  return (
    <>
      <Modal>
        <AddCameraPositionModal />
      </Modal>

      <Heading
        subcontent={
          <>
            <ArrowRight />
            <span>Project Name</span>
            <ArrowRight />
            <span>Variant Name</span>
          </>
        }
      >
        Project
      </Heading>

      <div className="p-10">
        <h1 className="text-2xl font-semibold">Camera Position</h1>
        <div className="mt-10 flex flex-wrap gap-6">
          <Variant.Create onClick={() => setModalState(true)} title='Add Camera Position' />

          {Array(5)
            .fill(1)
            .map((t, i) => (
              <Variant.Card key={i} title='Camera Position' to={'camera-position/123'} />
            ))}
        </div>
      </div>
    </>
  );
}
