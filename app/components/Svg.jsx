import React from 'react';
/**
 * @type {React.FC<{
 * icon: import('../SvgSymbols').SvgIconNames,'),
 * href: string,
 * }>}
 */
const Svg = ({ icon = '', href = '', label = '', className }) => {
  const classes = [href, className];
  if (icon) {
    classes.push(`icon icon--${icon}`);
  }
  href = icon ? `#icon-${icon}` : href;
  return (
    <>
      {label && <span className="visually-hidden">{label}</span>}
      <svg className={classes.filter(Boolean).join(' ')}>
        <use xlinkHref={href}></use>
      </svg>
    </>
  );
};

export default Svg;
