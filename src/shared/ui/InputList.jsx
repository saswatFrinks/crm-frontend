import React from 'react';
import { FaPlus } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import { v4 as uuidv4 } from 'uuid';

export default function InputList(props) {
  const { placeholder = 'Enter placeholder', formik, field } = props;
  const [input, setInput] = React.useState('');

  const [list, setList] = React.useState([
    {
      value: '',
      id: uuidv4(),
    },
  ]);

  const add = () => {
    setList((t) => {
      const newList = [...t, { value: input, id: uuidv4() }];
      formik.setFieldValue(field, newList);
      return newList;
    });
    setInput('');
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      {list.map((t, i) => (
        <div className="relative" key={i}>
          <input
            type="text"
            className={` max-w-sm rounded-md border py-2.5 pl-2.5 pr-8 outline-1 placeholder:text-gray-400  focus:border-f-primary focus:outline-[2px] focus:outline-f-primary  focus:ring-f-primary focus-visible:outline-f-primary `}
            placeholder={placeholder}
            onChange={(e) => setInput(e.target.value)}
          />
          {i !== 0 && (
            <IoClose
              className="absolute right-3 top-[14px] cursor-pointer"
              onClick={() => {
                if (i == 0) return;
                setList((ls) => {
                  const newList = ls.filter((k) => k.id !== t.id);
                  formik.setFieldValue('variants', newList);
                  return newList;
                });
              }}
            />
          )}
        </div>
      ))}

      <div
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md bg-f-primary hover:bg-f-secondary"
        onClick={add}
      >
        <FaPlus className="text-white" />
      </div>
    </div>
  );
}
