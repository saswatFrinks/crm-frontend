import Heading from '@/shared/layouts/main/heading';
import Variant from './Variant';
import { useSetRecoilState } from 'recoil';
import { modalAtom } from '@/shared/states/modal.state';
import Modal from '@/shared/ui/Modal';
import AddVariantModal from './AddVariantModal';
import ArrowRight from '@/shared/icons/ArrowRight';
import { Link, useLocation, useParams } from 'react-router-dom';
import axiosInstance from '@/core/request/aixosinstance';
import React from 'react';

export default function Variants() {
  const setModalState = useSetRecoilState(modalAtom);
  const params = useParams();
  const [variants, setVariants] = React.useState([]);
  const location = useLocation();

  const deleteVariant = async (id) => {
    try {
      await axiosInstance.delete('/variant', {
        params: {
          id
        }
      })
      fetchAllVariants()
    } catch (error) {
      console.log(error)
    }
  }

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
              state={location.state}
            >
              <ArrowRight />
              <span>{location.state.projectName}</span>
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
              id={variant.id}
              to={`variant/${variant.id}`}
              title={variant.name}
              deleteFn={()=>{
                deleteVariant(variant.id)
              }}
              state={{...location.state, variantName: variant.name}}
            />
          ))}
        </div>
      </div>
    </>
  );
}
