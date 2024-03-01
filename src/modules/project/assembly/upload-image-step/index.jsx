import React from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { selectedFileAtom, uploadedFileListAtom } from '../../state';
import Checkbox from '@/shared/ui/Checkbox';
import X from '@/shared/icons/X';
import Radio from '@/shared/ui/Radio';

export default function UploadImageStep() {
  const [images, setImages] = useRecoilState(uploadedFileListAtom);

  const setSelectedFile = useSetRecoilState(selectedFileAtom);

  const removeImage = (id) => {
    setImages((t) => t.filter((k) => k.id !== id));
  };

  const onChange = (e, id) => {
    setImages((t) =>
      t.map((k) => ({
        ...k,
        checked: k.id == id ? e.target.checked : false,
      }))
    );

    setSelectedFile(images.find((t) => t.id == id));
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
            <Radio
              value={t.id}
              name={'images'}
              id={t.id}
              checked={t.checked}
              onChange={(e) => onChange(e, t.id)}
            />{' '}
            {t.fileName} <X onClick={() => removeImage(t.id)} />
          </li>
        ))}
      </ul>
    </div>
  );
}
