import { randomString, getRawType } from '../utils.js';

/**
 * @type {React.FC<React.InputHTMLAttributes & {
 * label: string,
 * classes: {},
 * options: Array<string | (React.OptionHTMLAttributes & { label: string, value: string })>,
 * }>}
 */
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
    <div
      className={['app-input', className, classes.root]
        .filter(Boolean)
        .join(' ')}
    >
      {type !== 'checkbox' && (
        <label htmlFor={id} className={classes.label}>
          {label}
        </label>
      )}

      {type === 'select' && (
        <select
          id={id}
          name={name}
          {...attrs}
          className={['radius-4 color-inherit bg-white', classes.input]
            .filter(Boolean)
            .join(' ')}
        >
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
          className={[
            'is-full border radius-4 p-4 color-inherit bg-white',
            classes.input,
          ]
            .filter(Boolean)
            .join(' ')}
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
