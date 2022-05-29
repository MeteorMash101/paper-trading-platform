import React from 'react';
import ResizeObserver from 'resize-observer-polyfill';

/**
 * Use ResizeObserver to listen for the changes to the dimensions of an element
 * @params ref - React ref
 * @returns {object} - { width, height, top, left }
 */
const useResize = (ref) => {
  const [dimensions, setDimensions] = React.useState(null);
  React.useEffect(() => {
    const element = ref.current;
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        setDimensions(entry.contentRect);
      });
    });
    resizeObserver.observe(element);
    return () => {
      resizeObserver.unobserve(element);
    };
  }, [ref]);
  return dimensions || {
    width: 0,
    height: 0,
    top: 0,
    left: 0,
  };
};

export default useResize;
