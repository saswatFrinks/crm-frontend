import React from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { selectedFileAtom, uploadedFileListAtom } from '../../state';
import X from '@/shared/icons/X';
import Radio from '@/shared/ui/Radio';
import Upload from '@/shared/icons/Upload';
import { v4 as uuidv4 } from 'uuid';
import toast, { Toaster } from 'react-hot-toast';

export default function UploadImageStep() {
  const [images, setImages] = useRecoilState(uploadedFileListAtom);

  const setSelectedFile = useSetRecoilState(selectedFileAtom);

  const imageTypes = [
    {
      key: 'master',
      label: 'One Master Image:',
      button: 'Upload Master Image',
      number: 1
    },
    {
      key: 'good',
      label: 'Four Good Images:',
      button: 'Upload Images',
      number: 4
    },
    {
      key: 'bad',
      label: 'Five Bad Images:',
      button: 'Upload Images',
      number: 5
    }
  ]

  const removeImage = (id) => {
    setImages((t) => t.filter((k) => k.id !== id));
  };

  const onChange = (file) => {
    setSelectedFile(file);
  };

  const handleChangeFile = (e, type, index) => {
    const fileList = e.target.files;
  
    if (fileList.length !== imageTypes[index].number) {
      toast.error(`Please select exactly ${imageTypes[index].number} images`);
      return;
    }
  
    const files = Array.from(fileList);
    const allFilesArePNG = files.every((file) => file.type === 'image/png');
  
    if (!allFilesArePNG) {
      toast.error('Please select only PNG images');
      return;
    }
  
    const imagesToAdd = files.map((file) => ({
      id: uuidv4(),
      fileName: file.name,
      url: URL.createObjectURL(file),
      checked: false,
      type,
    }));
  
    const oldImages = [...images.filter((img) => img.type !== type), ...imagesToAdd];
  
    if (type === 'master') {
      onChange(oldImages.find((img) => img.type === 'master'));
    }
  
    setImages(oldImages);
  };
  

  return (
    <div>
      <Toaster position="top-center" />
      <p>
        Upload one master image of perfectly good product for configuring inspection parameters. 
        Additionally, upload four good images and five bad images evaluating project complexity.{' '}
      </p>

      <div className="mt-4 flex flex-col gap-4">
        {
          imageTypes.map((image, index) => {
            return <div className="my-1" key={index}>
              <div className="text-lg font-bold m-2">
                {image.label}
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-f-primary px-20 py-2 text-white duration-100 hover:bg-f-secondary">
                <Upload /> {image.button}
                <input type="file" accept='.png' hidden onChange={(e) => {
                  handleChangeFile(e, image.key, index);
                  e.target.value = null;
                  e.target.files = null;
                }} multiple={image.number > 1} />
              </label>
              <ul className="mt-3 pl-2 flex flex-col gap-4">
                {images.filter(img => img.type === image.key).map((t, i) => (
                  <li key={t.id} className="flex items-center gap-4">
                    {i + 1}. 
                    {t.fileName} 
                    <X onClick={() => removeImage(t.id)} />
                  </li>
                ))}
              </ul>
            </div>
          })
        }
      </div>
    </div>
  );
}
