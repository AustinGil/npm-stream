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
  errors = [],
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

  const ariaDescribedby = [];
  if (attrs['aria-describedby']) {
    ariaDescribedby.push(attrs['aria-describedby']);
  }
  if (errors.length > 0) {
    ariaDescribedby.push(`${id}__error`);
  }

  const sharedAttrs = {
    id: id ? id : `id-${randomString(6)}`,
    name: name,
  };
  if (ariaDescribedby.length) {
    sharedAttrs['aria-describedby'] = ariaDescribedby.join(' ');
  }

  return (
    <div
      className={[
        'app-input',
        errors.length && 'app-input--error',
        className,
        classes.root,
      ]
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
          {...sharedAttrs}
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
          {...sharedAttrs}
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

      {errors.length > 0 && (
        <ul id={`${id}__error`} className="app-input__error flex color-error">
          {errors.map((error) => (
            <li key={error}>{error}.&nbsp;</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Input;
