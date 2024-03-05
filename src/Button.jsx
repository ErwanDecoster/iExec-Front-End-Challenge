import { useRef } from 'react';

export default function Button({ children, size, pending, disabled, onClick, type }) {
  const buttonRef = useRef(null);

  const handleMouseMove = (e) => {
    let x = e.clientX - buttonRef.current.getBoundingClientRect().left;
    let y = e.clientY - buttonRef.current.getBoundingClientRect().top;
    buttonRef.current.style.setProperty('--x', x + 'px');
    buttonRef.current.style.setProperty('--y', y + 'px');
  };

  return (
    <button
      onClick={onClick}
      ref={buttonRef}
      className={type + ' ' + `${size === 'small' ? 'py-2 px-4' : 'py-3 px-4'}`}
      onMouseMove={handleMouseMove}
      disabled={(pending || disabled) && type == 'primary'}
    >
      {pending && type == 'primary' ? 'Initializing...' : children}
    </button>
  );
}
