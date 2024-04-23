import { tv } from 'tailwind-variants';

export default function Select({ size, placeholder, ...props }) {
  const { options = [], formik, field, errorMessage, value, onChange } = props;
  const select = tv({
    base: 'block w-full  border text-gray-300 border-gray-300 bg-white  text-sm text-gray-900 focus:border-f-primary focus:ring-f-primary focus-visible:border-f-primary focus-visible:outline-f-primary',
    variants: {
      size: {
        xs: 'p-1.5 rounded-md',
        sm: 'p-2.5 rounded-lg',
      },
    },
    defaultVariants: {
      size: 'sm',
    },
  });
  return (
    <>
      {formik ? <select
        className={select({ size })}
        onChange={(e) => {
          formik.setFieldValue(field, e.target.value)
        }}
      >
        {options.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>: 
      <select
      className={select({ size })}
      value={value}
      onChange={onChange}
    >
      <option value={""} disabled selected>{placeholder}</option>
      {options.map((t) => (
        <option key={t.id} value={t.id}>
          {t.name}
        </option>
      ))}
    </select>}
      {errorMessage ? (
        <p className="text-xs text-red-500">{errorMessage}</p>
      ) : null}
    </>
  );
}
