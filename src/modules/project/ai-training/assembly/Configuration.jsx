import Checkbox from '@/shared/ui/Checkbox';
import Chip from '@/shared/ui/Chip';
import Label from '@/shared/ui/Label';

export default function Configuration() {
  const columns = [
    'Variant',
    'Camera Position',
    'Camera Config',
    'ROI',
    'Classes',
  ];
  return (
    <div className="flex flex-col gap-8">
      <h3 className=" text-2xl font-semibold">Configurations & Classes</h3>
      <p>
        Select the configuration and classes you wish to train this AI model
        for. You can only train a single AI model for a particular class and
        only single AI model can run within a ROI. System will automatically
        select classes within same ROI, and ROI configurations containing same
        classes.
      </p>

      <div className="flex flex-col gap-4">
        <p>Select classes to be trained in this AI model:</p>
        <div className="flex gap-4">
          <div className="flex gap-2">
            <Checkbox
              id="class"
              value="class1"
              name="class"
              htmlFor="class1"
              checked={false}
            />
            <Label htmlFor="class1" main={false}>
              Class 1
            </Label>
          </div>
          <div className="flex gap-2">
            <Checkbox
              id="class"
              value="class1"
              name="class"
              htmlFor="class1"
              checked={false}
            />
            <Label htmlFor="class1" main={false}>
              Class 2
            </Label>
          </div>
          <div className="flex gap-2">
            <Checkbox
              id="class"
              value="class1"
              name="class"
              htmlFor="class1"
              checked={true}
            />
            <Label htmlFor="class1" main={false}>
              Class 3
            </Label>
          </div>
          <div className="flex gap-2">
            <Checkbox
              id="class"
              value="class1"
              name="class"
              htmlFor="class1"
              checked={false}
            />
            <Label htmlFor="class1" main={false}>
              Class 4
            </Label>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <p>Select classes to be trained in this AI model:</p>
        <div className="placeholder:*: relative shadow-md sm:rounded-lg">
          <table className="w-full text-left text-sm text-gray-500 rtl:text-right ">
            <thead className="bg-white text-sm uppercase text-gray-700 ">
              <tr>
                {columns.map((t) => (
                  <th scope="col" className="px-6 py-3" key={t}>
                    {t}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array(4)
                .fill(1)
                .map((plant, index) => {
                  return (
                    <tr
                      className="border-b odd:bg-white even:bg-[#C6C4FF]/10"
                      key={plant.id}
                    >
                      <th
                        scope="row"
                        className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 "
                      >
                        Variant 1
                      </th>
                      <td className="px-6 py-4">CP1</td>
                      <td className="px-6 py-4">CC1</td>
                      <td className="px-6 py-4">ROI 1</td>
                      {/* <td className={`px-6 py-4 ${statusObj['success']}`}>-</td> */}
                      <td className="flex flex-wrap gap-2 px-6 py-4">
                        <Chip color={`color-${index}`}>Class 1</Chip>
                        <Chip color={`color-${index + 1}`}>Class 2</Chip>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
