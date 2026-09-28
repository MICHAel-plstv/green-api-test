import React, { useState } from 'react';

import { Avatar } from '@/components/Avatar';

import { useAppDispatch, useAppSelector } from '@/store/hooks';

import { MessageBubble } from '../MessageBubble';

import { formatPhone } from '../../helpers/utils';

import { selectChat, sendTextMessage } from '../../store/chatsSlice';

import './style.css';

interface ChatWindowProps {
  chatId: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ chatId }) => {
  const dispatch = useAppDispatch();

  const chat = useAppSelector((state) => selectChat(state, chatId));

  const [text, setText] = useState('');

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = text.trim();
    if (!message) return;

    dispatch(sendTextMessage({ chatId, text: message }));
    setText('');
  };

  return (
    <section className='chat-window'>
      <header className='chat-window__header'>
        <Avatar />
        <div>
          <h2 className='chat-window__title'>
            {chat?.name ?? formatPhone(chatId)}
          </h2>
          {chat?.name && (
            <span className='chat-window__subtitle'>{formatPhone(chatId)}</span>
          )}
        </div>
      </header>
      <div className='chat-window__messages'>
        <div className='chat-window__list'>
          {chat?.messages.map((message) => (
            <MessageBubble key={message.id} {...message} />
          ))}
        </div>
      </div>
      <form onSubmit={onSubmit} className='chat-window__composer'>
        <input
          autoFocus
          value={text}
          aria-label='Сообщение'
          className='chat-window__input'
          placeholder='Введите сообщение'
          onChange={(event) => setText(event.target.value)}
        />
        <button
          type='submit'
          aria-label='Отправить'
          disabled={!text.trim()}
          className='chat-window__send'
        >
          <svg viewBox='0 0 24 24' aria-hidden='true'>
            <path d='M2.01 21 23 12 2.01 3 2 10l15 2-15 2z' />
          </svg>
        </button>
      </form>
    </section>
  );
};

export default ChatWindow;
