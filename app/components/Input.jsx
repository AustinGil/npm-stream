import { randomString, getRawType } from '../utils.js';

/** @type {import('react').FunctionComponentElement} */
const Input = ({
  id,
  name,
  label,
  className,
  classes = {},
  type = 'text',
  options = [],
  ...attrs
}) => {
  if (!label) console.warn('Input is missing a label');
  if (!name) console.warn('Input is missing a name');

  /**
   * @type {Array<{
   *  label: string,
   *  value: string | number,
   * }>}
   */
  const computedOptions = options.map((option) => {
    if (getRawType(option) !== 'object') {
      option = {
        label: option,
        value: option,
      };
    }
    return option;
  });

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
          {computedOptions.map((option) => (
            <option key={option.value} {...option}>
              {option.label}
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
