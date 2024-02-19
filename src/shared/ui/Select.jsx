import React from 'react';

export default function Select(props) {
  const { options = [], formik, field, errorMessage } = props;
  return (
    <>
    <select
      onChange={(e) => {
        formik.setFieldValue(field, e.target.value)
      }}
      className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-f-primary focus:ring-f-primary focus-visible:border-f-primary focus-visible:outline-f-primary"
    >
      {options.map((t) => (
        <option key={t.id} value={t.id}>
          {t.name}
        </option>
      ))}
      
    </select>
    {errorMessage ? (
      <p className="text-xs text-red-500">{errorMessage}</p>
    ) : null}
    </>
  );
}
