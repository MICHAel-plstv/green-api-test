import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';

import { useAppDispatch } from '@/store/hooks';

import { logOut } from '@/store/authSlice';

import './style.css';

export const Header = () => {
  const dispatch = useAppDispatch();

  return (
    <header className='sidebar-header'>
      <Avatar />

      <Button
        className='sidebar-header__logout'
        onClick={() => dispatch(logOut())}
      >
        Выйти
      </Button>
    </header>
  );
};

export default Header;
