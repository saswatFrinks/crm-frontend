
import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { v4 as uuidv4 } from 'uuid';

export default function InputTag(props) {
  const {
    placeholder = 'Enter placeholder',
    formik,
    field,
    initialTags = [],
    errorMessage,
  } = props;
  const [tagValue, setTagValue] = useState('');
  const [tags, setTags] = useState([]);

  const addTag = (e) => {
    if (e.key === 'Enter' && tagValue.trim() !== '') {
      const newTag = { value: tagValue.trim(), id: uuidv4(), removable: true };

      const newTags = [...tags, newTag];

      setTags(newTags);
      setTagValue('');

      formik.setFieldValue(field, newTags);
      
      
    } else if (
      e.key === 'Backspace' &&
      tagValue === '' &&
      tags.length > 0 &&
      tags[tags.length - 1].removable
    ) {
      removeTag(tags[tags.length - 1].id);
    }
  };

  const removeTag = (id) => {
    const newTags = tags.filter((tag) => tag.id !== id);

    setTags(newTags);

    formik.setFieldValue(field, newTags);
  };

  return (
    <div className="flex w-full flex-wrap items-center gap-4">
      <div className="relative flex w-full flex-wrap items-center rounded-md border border-gray-300 p-2">
        {initialTags.length > 0 &&
          initialTags.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center rounded-md bg-gray-200 px-2 mx-1"
            >
              <span className="mr-2">{tag.value}</span>
            </div>
          ))}

        {tags.map((tag) => (
          <div
            key={tag.id}
            className="flex items-center rounded-md bg-gray-200 px-2 m-1"
          >
            <span className="mr-2">{tag.value}</span>
            <IoClose
              className="cursor-pointer"
              onClick={() => removeTag(tag.id)}
            />
          </div>
        ))}
        <input
          type="text"
          className="flex-grow text-wrap p-1 outline-none"
          placeholder={placeholder}
          value={tagValue}
          onChange={(e) => setTagValue(e.target.value)}
          onKeyDown={addTag}
        />
      </div>
      {errorMessage ? (
        <p className="text-xs text-red-500">{errorMessage}</p>
      ) : null}
    </div>
  );
}
