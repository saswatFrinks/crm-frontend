import ArrowRight from '@/shared/icons/ArrowRight';
import Heading from '@/shared/layouts/main/heading';
import React from 'react';
import Variant from '../variants/Variant';
import { useSetRecoilState } from 'recoil';
import { modalAtom } from '@/shared/states/modal.state';
import Modal from '@/shared/ui/Modal';
import AddFolderModal from './AddFolderModal';

export default function DataSet() {
  const setModalState = useSetRecoilState(modalAtom);

  return (
    <>
      <Modal>
        <AddFolderModal />
      </Modal>

      <Heading
        subcontent={
          <>
            <ArrowRight />
            <span>Project Name</span>
            <ArrowRight />
            <span>Variant Name</span>
            <ArrowRight />
            <span>Camera Position</span>
            <ArrowRight />
            <span>Camera Config</span>
          </>
        }
      >
        Project
      </Heading>

      <div className="p-10">
        <h1 className="text-2xl font-semibold">Data Sets</h1>
        <div className="mt-10 flex flex-wrap gap-6">
          <Variant.Create
            onClick={() => setModalState(true)}
            title="Create Folder"
          />

          {Array(5)
            .fill(1)
            .map((t, i) => (
              <Variant.Card
                key={i}
                title="Folder Name"
                to={'folder/123'}
              />
            ))}
        </div>
      </div>
    </>
  );
}
