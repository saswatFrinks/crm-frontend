import React from 'react';
import { FaPlus } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import { v4 as uuidv4 } from 'uuid';

export default function InputList(props) {
  const { placeholder = 'Enter placeholder', formik, field, errorMessage } = props;

  const [list, setList] = React.useState([
    {
      value: '',
      id: uuidv4(),
    },
  ]);

  const handleInputChange = (id, value) => {
    const updatedList = list.map((item) =>
      item.id === id ? { ...item, value } : item
    );
    setList(updatedList);
    formik.setFieldValue(field, updatedList);
  };

  const add = () => {
    const hasEmptyValue = list.filter((t) => t.value === '').length !== 0;
    
    if(hasEmptyValue) {
      return
    }

    const newList = [...list, { value: '', id: uuidv4() }];
    setList(newList);
    formik.setFieldValue(field, newList);
    console.log(newList)
  };

  const remove = (id) => {
    const newList = list.filter((item) => item.id !== id);
    setList(newList);
    formik.setFieldValue(field, newList);
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      {list.map((t, i) => (
        <div className="relative" key={t.id}>
          <input
            type="text"
            className={` max-w-sm rounded-md border py-2.5 pl-2.5 pr-8 outline-1 placeholder:text-gray-400  focus:border-f-primary focus:outline-[2px] focus:outline-f-primary  focus:ring-f-primary focus-visible:outline-f-primary `}
            placeholder={placeholder}
            value={t.value}
            onChange={(e) => handleInputChange(t.id, e.target.value)}
          />
          {t.value && 
            <IoClose
              className="absolute right-3 top-[14px] cursor-pointer"
              onClick={() => remove(t.id)}
            />
          }
        </div>
      ))}

      <div
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md bg-f-primary hover:bg-f-secondary"
        onClick={add}
      >
        <FaPlus className="text-white" />
      </div>
      {errorMessage ? (
      <p className="text-xs text-red-500">{errorMessage}</p>
    ) : null}
    </div>
  );
}
