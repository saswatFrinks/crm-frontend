import React from 'react';
import { useRecoilState } from 'recoil';
import { uploadedFileListAtom } from '../state';
import Checkbox from '@/shared/ui/Checkbox';
import X from '@/shared/icons/X';
import Radio from '@/shared/ui/Radio';

export default function UploadImageStep() {
  const [images, setImages] = useRecoilState(uploadedFileListAtom);

  const removeImage = (id) => {
    setImages((t) => t.filter((k) => k.id !== id));
  };

  return (
    <div>
      <p>
        Upload five good and five bad images to configure the project and
        perform pre-training analysis. Mark any one good image as a master
        image.{' '}
      </p>

      <ul className="mt-4 flex flex-col gap-4">
        {images.map((t, i) => (
          <li key={t.id} className="flex items-center gap-2">
            {i + 1}.
            <Radio /> {t.fileName} <X onClick={() => removeImage(t.id)} />
          </li>
        ))}
      </ul>
    </div>
  );
}
