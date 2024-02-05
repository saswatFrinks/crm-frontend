import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import '@/shared/styles/phone.css';

export default function FPhoneInput({ errorMessage, ...props }) {
  return (
    <div>
      <PhoneInput
        {...props}
        className={`${errorMessage ? 'error' : ''}`}
      />
      {errorMessage ? (
        <p className="mt-1 text-xs text-red-500">{errorMessage}</p>
      ) : null}
    </div>
  );
}
