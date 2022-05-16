import { randomString } from '../utils.js';
const Input = ({
  id,
  name,
  label,
  className,
  classes = {},
  type = 'text',
  options,
  ...attrs
}) => {
  if (!label) console.warn('Input is missing a label');
  if (!name) console.warn('Input is missing a name');

  id = id ? id : `id-${randomString(6)}`;
  return (
    <div className={[className, classes.root].filter(Boolean).join(' ')}>
      {type !== 'checkbox' && (
        <label htmlFor={id} className={classes.label}>
          {label}
        </label>
      )}

      {type === 'select' && (
        <select id={id} name={name} {...attrs} className={classes.input}>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}

      {type !== 'select' && (
        <input
          id={id}
          name={name}
          type={type}
          {...attrs}
          className={classes.input}
        />
      )}

      {type === 'checkbox' && (
        <label htmlFor={id} className={classes.label}>
          {label}
        </label>
      )}
    </div>
  );
};

export default Input;
