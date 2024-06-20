import Chip from '@/shared/ui/Chip';

const Dropdown = ({ data, selectedModels, classColors, isPrimary = false }) => {
  const roiData = data.models.find(
    (model) => model.id === selectedModels.get(data.roiId)
  );

  const columns = ['', '', 'Model Name', 'Class', '', ''];

  const getAlignment = (column) => {
    switch (column) {
      case 'Class':
        return 'text-center';
      default:
        return 'text-left';
    }
  };

  return (
    <>
      <tr className="bg-white px-6 py-4"></tr>
      <tr className="bg-white">
        {columns.map((t) => (
          <th
            className={`px-6 py-3 ${getAlignment(t)} ${t ? 'border border-gray-300 bg-[#E6E6E6]' : 'bg-white'}`}
            key={t}
          >
            {t}
          </th>
        ))}
      </tr>
      <tr className="border-b bg-white">
        <td></td>
        <td></td>
        <td className="border border-gray-300">
          <div className="my-2 flex flex-col items-start gap-4 px-4">
            {roiData?.name}
            <div className="flex flex-wrap items-center gap-4">
              {roiData?.classes?.map((id) => {
                return (
                  <Chip color={classColors.get(id)?.color}>
                    {classColors.get(id)?.name}
                  </Chip>
                );
              })}
            </div>
          </div>
        </td>
        <td className="border border-gray-300">
          <div className="my-2 flex flex-col items-center gap-4 p-2">
            {!isPrimary
              ? data?.classes?.map((classData) => {
                  return (
                    <Chip color={classColors.get(classData.id)?.color}>
                      {classColors.get(classData.id)?.name}
                    </Chip>
                  );
                })
              : roiData?.classes?.map((id) => {
                  return (
                    <Chip color={classColors.get(id)?.color}>
                      {classColors.get(id)?.name}
                    </Chip>
                  );
                })}
          </div>
        </td>
        <td></td>
        <td></td>
      </tr>
      <tr></tr>
    </>
  );
};

export default Dropdown;
