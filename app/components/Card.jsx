import React from 'react';
import { Link } from '@remix-run/react';
/**
 * @type {React.FC<{
 * }>}
 */
const Btn = ({
  title = '',
  to = '',
  thumb = '',
  thumbAlt,
  className,
  children,
  ...attrs
}) => {
  if (thumb && thumbAlt === undefined) console.warn('thumbAlt is required');

  let contentClassName = 'border p-8 bg-white';
  contentClassName += thumb ? ' radius-b-4' : ' radius-4';

  return (
    <div
      className={['card relative', className].filter(Boolean).join(' ')}
      {...attrs}
    >
      {thumb && <img src={thumb} alt={thumbAlt} className="radius-t-4" />}

      <div className={contentClassName}>
        {title && (
          <h3>
            {to && (
              <Link to={to} className="card__link">
                {title}
              </Link>
            )}
            {!to && title}
          </h3>
        )}
        {children}
      </div>
    </div>
  );
};

export default Btn;
