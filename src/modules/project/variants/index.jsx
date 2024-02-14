import Heading from '@/shared/layouts/main/heading';
import Variant from './Variant';
import { useSetRecoilState } from 'recoil';
import { modalAtom } from '@/shared/states/modal.state';
import Modal from '@/shared/ui/Modal';
import AddVariantModal from './AddVariantModal';
import ArrowRight from '@/shared/icons/ArrowRight';

export default function Variants() {
  const setModalState = useSetRecoilState(modalAtom);

  return (
    <>
      <Modal>
        <AddVariantModal />
      </Modal>

      <Heading
        subcontent={
          <>
            <ArrowRight />
            <span>Project Name</span>
          </>
        }
      >
        Project
      </Heading>

      <div className="p-10">
        <h1 className="text-2xl font-semibold">Variants</h1>
        <div className="mt-10 flex flex-wrap gap-6">
          <Variant.Create onClick={() => setModalState(true)} />

          {Array(10)
            .fill(1)
            .map((t, i) => (
              <Variant.Card key={i} to={'variant/123'} />
            ))}
        </div>
      </div>
    </>
  );
}
