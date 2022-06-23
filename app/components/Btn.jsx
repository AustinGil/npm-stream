import React from 'react';
import { Link } from '@remix-run/react';
/**
 * @type {React.FC<{
 * label: string,
 * to: string,
 * type?: 'button' | 'submit',
 * isPlain: boolean
 * }>}
 */
const Btn = ({
  href,
  to,
  type = 'button',
  className = '',
  isPlain,
  children,
  ...attrs
}) => {
  let tag;
  if (href) {
    tag = 'a';
    attrs.href = href;
  } else if (to) {
    tag = Link;
    attrs.to = to;
  } else {
    tag = 'button';
    attrs.type = type;
  }

  const classes = [className];

  if (!isPlain) {
    classes.push(
      'border-2 rounded border-primary py-2 px-3 text-white bg-primary transition-all hover:border-rose-700 hover:bg-rose-700 focus:border-rose-700 focus:bg-rose-700'
    );
  }

  attrs.className = classes.filter(Boolean).join(' ');

  return React.createElement(tag, attrs, children);
};

export default Btn;
