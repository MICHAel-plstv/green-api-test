import React from 'react';
import { NavLink } from 'react-router';

import { Avatar } from '@/components/Avatar';

import { formatTime, formatPhone, toPhone } from '../../../../helpers/utils';

import type { Chat } from '../../../../store/types';

import './style.css';

export const ChatItem: React.FC<{
  chat: Chat;
}> = ({ chat }) => {
  const lastMessage = chat.messages.at(-1);

  return (
    <NavLink
      to={`/chat/${toPhone(chat.id)}`}
      className={({ isActive }) =>
        isActive ? 'chat-item chat-item--active' : 'chat-item'
      }
    >
      <Avatar />

      <span className='chat-item__body'>
        <span className='chat-item__row'>
          <span className='chat-item__name'>
            {chat.name ?? formatPhone(chat.id)}
          </span>

          {lastMessage && (
            <time className='chat-item__time'>
              {formatTime(lastMessage.timestamp)}
            </time>
          )}
        </span>

        <span className='chat-item__preview'>
          {lastMessage?.text ?? 'Нет сообщений'}
        </span>
      </span>
    </NavLink>
  );
};

export default ChatItem;
