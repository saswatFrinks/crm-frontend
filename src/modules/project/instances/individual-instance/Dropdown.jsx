import Chip from "@/shared/ui/Chip";

const Dropdown = ({data, selectedModels, classColors}) => {
  const roiData = data.models.find(model => model.id === selectedModels.get(data.roiId));

  const columns = ['', 'Model Name', 'Class', 'Threshold', '', ''];

  const getAlignment = (column) => {
    switch (column){
      case 'Class':
        return 'text-center'
      case 'Threshold':
        return 'text-right'
      default:
        return 'text-left'
    }
  }

  return (
    <>
      <tr className="bg-white px-6 py-4"></tr>
      <tr className="bg-white">
        {columns.map((t) => (
          <th scope="col" className={`px-6 py-3 ${getAlignment(t)} ${t ? 'border border-gray-300 bg-[#E6E6E6]' : 'bg-white'}`} key={t}>
            {t}
          </th>
        ))}
      </tr>
      <tr className="bg-white border-b">
        <td></td>
        <td className='border border-gray-300'>
          <div className="flex flex-col items-start gap-4 my-2 px-4">
            {roiData?.name}
            <div className="flex items-center gap-4 flex-wrap">
              {roiData?.classes?.map((id) => {
                return <Chip color={classColors.get(id)?.color}>{classColors.get(id)?.name}</Chip>
              })}
            </div>
          </div>
        </td>
        <td className='border border-gray-300'>
          <div className="flex flex-col items-center gap-4 my-2 p-2">
            {data?.classes?.map((classData) => {
              return <Chip color={classColors.get(classData.id)?.color}>{classColors.get(classData.id)?.name}</Chip>
            })}
          </div>
        </td>
        <td className='border border-gray-300 text-right'></td>
        <td></td>
        <td></td>
      </tr>
      <tr></tr>
    </>
  );
};

export default Dropdown;
