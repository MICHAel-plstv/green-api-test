import React from 'react';

import { formatTime } from '../../helpers/utils';
import { STATUS_ICONS, STATUS_LABELS } from '../../helpers/constants';

import type { Message } from '../../store/types';

import './style.css';

export const MessageBubble: React.FC<Message> = ({
  text, status, timestamp, isOutgoing,
}) => {
  return (
    <div className={`message message--${isOutgoing ? 'outgoing' : 'incoming'}`}>
      <p className='message__text'>{text}</p>

      <span className='message__meta'>
        <time>{formatTime(timestamp)}</time>

        {isOutgoing && (
          <span
            role='img'
            aria-label={STATUS_LABELS[status]}
            className={`message__status message__status--${status}`}
          >
            {STATUS_ICONS[status]}
          </span>
        )}
      </span>
    </div>
  );
};

export default MessageBubble;
