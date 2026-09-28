import './style.css';

export const Avatar = () => {
  return (
    <span className='avatar' aria-hidden='true'>
      <svg viewBox='0 0 40 40'>
        <circle cx='20' cy='15' r='7' />
        <path d='M6 36c0-7.7 6.3-12 14-12s14 4.3 14 12z' />
      </svg>
    </span>
  );
};

export default Avatar;
