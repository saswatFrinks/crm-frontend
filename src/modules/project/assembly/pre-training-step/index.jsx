export default function PreTrainingStep() {
  const columns = ['', 'Positive', 'Negative'];
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-center text-2xl font-semibold">
        Your project is configured!{' '}
      </h3>
      <p className="text-center text-lg">
        Below are the data recommendations for good training results
      </p>

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
                  key={index}
                >
                  <th
                    scope="row"
                    className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 "
                  >
                    Overall
                  </th>
                  <td className="px-6 py-4">200</td>
                  <td className="px-6 py-4">156</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
