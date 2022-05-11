import { randomString } from '../utils.js';
const Input = ({ id, name, label, className, ...attrs }) => {
  if (!label) console.warn('Input is missing a label');
  if (!name) console.warn('Input is missing a name');

  id = id ? id : `id-${randomString(6)}`;
  return (
    <div className={className}>
      <label htmlFor={id}>{label}</label>
      <input id={id} name={name} {...attrs} />
    </div>
  );
};

export default Input;
