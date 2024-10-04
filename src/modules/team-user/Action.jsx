import React from 'react';
import { HiDotsVertical } from 'react-icons/hi';
import { FaDownload, FaRegTrashCan } from 'react-icons/fa6';
import { FiEdit2 } from 'react-icons/fi';
import useClickOutSide from '@/shared/hooks/useClickOutside';
import { FiKey } from 'react-icons/fi';
import { tv } from 'tailwind-variants';
import axiosInstance from '@/core/request/aixosinstance';

export default function Action(props) {
  const {
    handleOpenModal,
    hasReset = false,
    id,
    setId,
    editIndex,
    handleEdit,
    deleteImageById = null,
    allowDelete = true,
    name = null,
  } = props;
  const [open, setOpen] = React.useState(false);

  const ref = React.useRef(null);

  useClickOutSide(ref, () => setOpen(false));

  const ul = tv({
    base: 'absolute right-4 w-full top-0 rounded-md bg-white shadow-xl border',
    variants: {
      hasReset: {
        true: 'w-32',
        false: 'w-24',
      },
    },
  });

  const handleDownload = async () => {
    try {
      const response = await axiosInstance.get('/plant/download', {
        params: {
          plantId: id,
        },
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${name.replace(' ', '_')}_init.sql`); // Specify the download filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading the file:', error);
    }
    setOpen(false);
  };

  return (
    <div className="relative flex justify-end">
      <HiDotsVertical
        size={18}
        className="cursor-pointer"
        onClick={() => setOpen(true)}
      />
      {open && (
        <ul className={ul({ hasReset })} ref={ref}>
          <li
            className="flex cursor-pointer items-center gap-2 p-2 text-xs hover:bg-gray-100"
            onClick={() => handleEdit(editIndex)}
          >
            <FiEdit2 /> Edit
          </li>
          {hasReset && (
            <li className="flex cursor-pointer items-center gap-2 p-2 text-xs hover:bg-gray-100">
              <FiKey /> Reset password
            </li>
          )}

          {allowDelete && (
            <li
              className="flex cursor-pointer items-center gap-2 p-2 text-xs text-red-500 hover:bg-gray-100"
              onClick={() => {
                if (setId) {
                  setId(id);
                }
                handleOpenModal('delete', id);

                if (deleteImageById) {
                  deleteImageById(id);
                }

                setOpen(false);
              }}
            >
              <FaRegTrashCan /> Delete
            </li>
          )}
          {name && (
            <li className="flex cursor-pointer items-center gap-2 p-2 text-xs hover:bg-gray-100" onClick={handleDownload}>
              <FaDownload /> Download
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
