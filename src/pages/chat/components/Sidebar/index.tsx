import { Header } from './components/Header';
import { ChatItem } from './components/ChatItem';
import { NewChatForm } from './components/NewChatForm';

import { useAppSelector } from '@/store/hooks';

import { selectChatList, selectPollingError } from '../../store/chatsSlice';

import './style.css';

export const Sidebar = () => {
  const chats = useAppSelector(selectChatList);
  const pollingError = useAppSelector(selectPollingError);

  return (
    <aside className='sidebar'>
      <Header />

      {pollingError && (
        <p role='status' className='sidebar__banner'>
          {pollingError}
        </p>
      )}

      <NewChatForm />

      <nav className='sidebar__list'>
        {chats.map((chat) => (
          <ChatItem key={chat.id} chat={chat} />
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
