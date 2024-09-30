import { tv } from 'tailwind-variants';
import { FaCheck } from 'react-icons/fa';

export default function Checkbox(props) {
  const { checked = true, htmlFor, onChange, ...rest } = props;
  const checkbox = tv({
    base: `border border-f-light-gray shadow shadow-f-dark-gray rounded-md w-6 flex items-center justify-center h-6 ${props.disabled ? "" : 'cursor-pointer'}`,
    variants: {
      checked: {
        true: 'bg-f-primary',
        false: 'bg-white',
      },
    },
  });

  return (
    <label className={checkbox({ checked })} htmlFor={htmlFor}>
      <input
        type="checkbox"
        hidden
        {...rest}
        checked={checked}
        onChange={onChange}
        disabled={props.disabled}
      />
      {checked ? <FaCheck className="text-white" size={12} /> : null}
    </label>
  );
}
