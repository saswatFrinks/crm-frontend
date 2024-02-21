import ArrowUp from '@/shared/icons/ArrowUp';
import Checkbox from '@/shared/ui/Checkbox';
import Label from '@/shared/ui/Label';
import React from 'react';
import { ChevronUp } from 'react-feather';

export default function DataSet() {
  const columns = ['Variant 1', 'CP1', 'CC1'];

  const [list, setList] = React.useState([
    {
      id: 1,
      open: true,
    },
    {
      id: 2,
      open: true,
    },
  ]);

  const toggle = (id) => {
    setList((t) =>
      t.map((k) => ({
        ...k,
        open: k.id == id ? !k.open : k.open,
      }))
    );
  };

  console.log(list);

  return (
    <div className="flex flex-col gap-8">
      <h3 className=" text-2xl font-semibold">Datasets</h3>
      <p>
        Select the dataset folders to be used for training this AI model. We
        recommend at least <span className="font-semibold">200 images</span> for
        good training results of this project.
      </p>

      <div>
        {list.map((k) => (
          <div
            key={k.id}
            className="placeholder:*: relative  py-2 odd:border-t-[1px] sm:rounded-lg"
          >
            <table className="w-full text-left text-sm text-gray-500  ">
              <thead className="bg-white text-sm uppercase text-gray-700 ">
                <tr>
                  {columns.map((t, i) => (
                    <th scope="col" key={t} className="w-1/3">
                      <div className="flex select-none items-center gap-2 px-2">
                        {i == 0 ? (
                          <ChevronUp
                            size={20}
                            onClick={() => toggle(k.id)}
                            className={`cursor-pointer duration-75 ${k.open ? '' : 'rotate-180'}`}
                          />
                        ) : null}
                        <span>{t}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              {k.open ? (
                <tbody>
                  <tr className="border-b ">
                    <th
                      scope="row"
                      className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 "
                    >
                      <div className="flex gap-2">
                        <Checkbox
                          id="class"
                          value="class1"
                          name="class"
                          htmlFor="class1"
                          checked={true}
                        />
                        <Label htmlFor="class1" main={false}>
                          Variant 1
                        </Label>
                      </div>
                    </th>
                    <td className="px-6 py-4">200 images</td>
                    <td className="py-4m px-6 text-green-500">
                      Annotations complete
                    </td>
                  </tr>

                  <tr className="border-b ">
                    <th
                      scope="row"
                      className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 "
                    >
                      <div className="flex gap-2">
                        <Checkbox
                          id="class"
                          value="class1"
                          name="class"
                          htmlFor="class1"
                          checked={false}
                        />
                        <Label htmlFor="class1" main={false}>
                          Variant 1
                        </Label>
                      </div>
                    </th>
                    <td className="px-6 py-4">200 images</td>
                    <td className="px-6 py-4 text-red-500">
                      Annotations incomplete
                    </td>
                  </tr>
                </tbody>
              ) : null}
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
