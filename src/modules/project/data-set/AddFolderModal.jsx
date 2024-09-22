import axiosInstance from '@/core/request/aixosinstance';
import Upload from '@/shared/icons/Upload';
import { modalAtom } from '@/shared/states/modal.state';
import Button from '@/shared/ui/Button';
import Dropdown from '@/shared/ui/Dropdown';
import Input from '@/shared/ui/Input';
import Label from '@/shared/ui/Label';
import { ModalBody, ModalFooter, ModalHeader } from '@/shared/ui/Modal';
import { useFormik } from 'formik';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

export default function AddFolderModal({ fetchAllFolders, editFolder }) {
  const setOpenModal = useSetRecoilState(modalAtom);
  const params = useParams();

  const [file, setFile] = useState(null);

  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [classesData, setClassesData] = useState(null);
  const [classMap, setClassMap] = useState({});

  if (Object.values(classMap).findIndex((e) => e == -1) > -1) {
    const list = {};
    for (let key in classMap) {
      if (classMap[key] != -1) {
        list[key] = classMap[key];
      }
    }
    setClassMap(list);
  }

  const classesMaped = Object.keys(classMap).length > 0;

  const handleFileUpload = async (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
    setFileName(uploadedFile?.name || '');
  };

  const handleSubmit = async () => {
    try {
      if (!file) {
        toast.error('Either give the Instance ID or upload instance file');
        return;
      }
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('projectId', params.projectId);
      const res = await axiosInstance.post('/dataset/upload/coco', formData);
      setClassesData(res.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const addFolder = async (values) => {
    try {
      if (editFolder) {
        await axiosInstance.put('/dataset/edit', {
          datasetId: editFolder?.id,
          name: values.name,
        });
      } else {
        await axiosInstance.post('/dataset/create', {
          cameraConfigId: params.cameraConfigId,
          folderName: values.name,
        });
      }

      fetchAllFolders();
    } catch (error) {
      toast.error(error?.response?.data?.data?.message);
    }
  };

  const completeImportCoco = async (values) => {
    await axiosInstance.put('/dataset/create/coco', {
      projectId: params.projectId,
    uuid: classesData.uuid,
    cameraConfigId:  params.cameraConfigId,
    datasetName: values.name,
    classMapping: classMap
    })
  };

  const formik = useFormik({
    initialValues: {
      name: editFolder?.name || '',
    },
    validate: (values) => {
      const errors = {};

      // Add your custom validation logic here
      if (!values.name) {
        errors.name = 'Folder name is required';
      }

      return errors;
    },
    onSubmit: async (values) => {
      try {
        if (classesData) {
          completeImportCoco(values);
        } else addFolder(values);
        setOpenModal(false);
      } catch (error) {
        toast.error(error?.response?.data?.data?.message);
      }
    },
  });

  return (
    <>
      <ModalHeader>Create Dataset Folder</ModalHeader>
      <ModalBody>
        <div className="mb-4">
          <Label>Folder name</Label>
          <Input
            placeholder="Enter folder name"
            type="name"
            name="name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            errorMessage={formik.errors.name}
          />
        </div>
        {!classesData && (
          <>
            <div className="mb-4">
              <Label>Upload Dataset (Optional)</Label>
              <label
                htmlFor="file"
                className="ml-2 inline-flex max-w-max cursor-pointer items-center gap-2 rounded-full bg-f-primary px-4 py-1.5 text-white  hover:bg-f-secondary"
              >
                <Upload />
                {fileName?.length ? 'Change' : 'Upload'}
                <input
                  type="file"
                  multiple={false}
                  hidden
                  id="file"
                  // accept=".png"
                  onChange={handleFileUpload}
                />
              </label>
              {fileName && <div>File uploaded: {fileName}</div>}
            </div>
            {fileName && (
              <Button size="xs" fullWidth={false} onClick={handleSubmit}>
                Proceed
              </Button>
            )}
          </>
        )}
        {classesData && (
          <div className="mx-1 mb-4">
            {classesData['projectClasses'].map((cls) => (
              <div className="mt-2" key={cls.id}>
                {'Class "'}
                <span className="text-blue-500">{cls.name}</span>
                {'" maps to '}
                <Dropdown
                  data={classesData.newClasses}
                  onClick={(id) =>
                    setClassMap((prev) => ({ ...prev, [cls.id]: id }))
                  }
                  selectedId={classMap[cls.id]}
                />
              </div>
            ))}
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <div className="ml-auto flex w-3/5 items-center justify-end gap-4">
          <Button
            size="xs"
            color="flat"
            fullWidth={true}
            onClick={() => setOpenModal(false)}
          >
            Cancel
          </Button>
          <Button
            size="xs"
            fullWidth={true}
            onClick={formik.handleSubmit}
            disabled={fileName?.length > 0 && !classesMaped}
          >
            Confirm
          </Button>
        </div>
      </ModalFooter>
    </>
  );
}
