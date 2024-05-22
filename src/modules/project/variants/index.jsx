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
import { CiFileOn } from 'react-icons/ci';
import Action from '@/modules/team-user/Action';
import DeleteModal from '@/modules/team-user/DeleteModal';
import EditVariantModal from './EditVariantModal';

export default function Variants() {
  const setModalState = useSetRecoilState(modalAtom);
  const params = useParams();
  const [variants, setVariants] = React.useState([]);
  const [action, setAction] = React.useState('add');
  const [editIndex, setEditIndex] = React.useState(0);
  const [id, setId] = React.useState('');
  const location = useLocation();

  // console.log(location);

  const deleteVariant = async () => {
    try {
      await axiosInstance.delete('/variant', {
        params: {
          id: id,
        },
      });
      fetchAllVariants();
    } catch (error) {
      toast.error(error.response.data.data.message);
    }
  };

  const fetchAllVariants = async () => {
    try {
      const res = await axiosInstance.get('/variant/fetch', {
        params: {
          projectId: params.projectId,
        },
      });

      setVariants(res.data.data);
    } catch (error) {
      toast.error(error.response.data.data.message);
    }
  };

  const renderModalAction = () => {
    const obj = {
      add: <AddVariantModal fetchAllVariants={fetchAllVariants} />,
      delete: <DeleteModal deleteById={deleteVariant} />,
      edit: (
        <EditVariantModal
          fetchAllVariants={fetchAllVariants}
          editVariant={variants[editIndex]}
        />
      ),
    };

    return obj[action];
  };

  const handleOpenModal = (type) => {
    setAction(type);
    setModalState(true);
  };

  const handleEdit = (index) => {
    handleOpenModal('edit');
    setEditIndex(index);
  };

  React.useEffect(() => {
    fetchAllVariants();
  }, []);
  return (
    <>
      <Modal>{renderModalAction()}</Modal>

      <Heading
        subcontent={
          <>
            <Link
              to={`/project/${params.projectId}`}
              className="flex items-center gap-2"
              state={location.state}
            >
              <ArrowRight />
              <span>{location.state?.projectName}</span>
            </Link>
          </>
        }
      >
        <Link to="/" className="mb-8">
          Project
        </Link>
      </Heading>

      <div className="p-10">
        <h1 className="text-2xl font-semibold">Variants</h1>
        <div className="mt-10 flex flex-wrap gap-6">
          <Variant.Create
            onClick={() => {
              handleOpenModal('add');
            }}
          />
          {variants.map((variant, i) => (
            <Link
              to={`variant/${variant.id}`}
              key={variant.id}
              state={{ ...location.state, variantName: variant.name }}
              className=" flex basis-80 items-center justify-between rounded-md border border-gray-300/90 bg-white px-10 py-4 shadow-sm"
            >
              <div className="inline-flex rounded-md bg-[#E7E7FF]/50 p-2">
                <CiFileOn className="h-6 w-6 text-f-primary duration-100 group-hover:h-6 group-hover:w-6" />
              </div>
              {variant.name}
              <div
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
              >
                <Action
                  id={variant.id}
                  handleEdit={handleEdit}
                  handleOpenModal={handleOpenModal}
                  editIndex={i}
                  setId={setId}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
