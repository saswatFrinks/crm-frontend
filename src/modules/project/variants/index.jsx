import Heading from '@/shared/layouts/main/heading';
import Variant from './Variant';
import { useSetRecoilState } from 'recoil';
import { modalAtom } from '@/shared/states/modal.state';
import Modal from '@/shared/ui/Modal';
import AddVariantModal from './AddVariantModal';
import ArrowRight from '@/shared/icons/ArrowRight';
import { Link, useParams } from 'react-router-dom';
import axiosInstance from '@/core/request/aixosinstance';
import React from 'react';

export default function Variants() {
  const setModalState = useSetRecoilState(modalAtom);
  const params = useParams();
  const [variants, setVariants] = React.useState([]);

  const fetchAllVariants = async () => {
    const res = await axiosInstance.get('/variant/fetch', {
      params: {
        projectId: params.projectId,
      },
    });

    setVariants(res.data.data);
  };

  React.useEffect(() => {
    fetchAllVariants();
  }, []);
  return (
    <>
      <Modal>
        <AddVariantModal fetchAllVariants={fetchAllVariants}/>
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
          </>
        }
      >
        Project
      </Heading>

      <div className="p-10">
        <h1 className="text-2xl font-semibold">Variants</h1>
        <div className="mt-10 flex flex-wrap gap-6">
          <Variant.Create onClick={() => setModalState(true)} />
          {variants.map((variant, i) => (
            <Variant.Card
              key={variant.id}
              to={`variant/${variant.id}`}
              title={variant.name}
            />
          ))}
        </div>
      </div>
    </>
  );
}
