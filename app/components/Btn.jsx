import React from 'react';
import { Link } from '@remix-run/react';
/**
 * @type {React.FC<{
 * label: string,
 * to: string,
 * type?: 'button' | 'submit',
 * }>}
 */
const Btn = ({
  href,
  to,
  type = 'button',
  className = '',
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

  attrs.className = ['radius-4 pi-12 color-white bg-primary', className]
    .filter(Boolean)
    .join(' ');

  return React.createElement(tag, attrs, children);
};

export default Btn;
