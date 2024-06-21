import { useEffect, useRef } from 'react';

import './MessageLog.css';
import { messageTypes } from '../minilogue/midi';
import { useAppSelector } from '../store';


export default function MessageLog() {
  const messages = useAppSelector(({ midi }) => midi.messages);

  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (container.current) {
      container.current.scrollTop = container.current.scrollHeight - container.current.offsetHeight;
    }
  }, [messages]);

  return (
    <div className='message-log' ref={container}>
      {messages.map(msg => (
        <p key={`${msg.messageType}-${msg.channel}-${msg.code}-${msg.timeStamp}`}>
          [{Math.floor(msg.timeStamp)}] {}
          {msg.input}: {}
          {messageTypes[msg.messageType] || msg.messageType} {}
          {msg.code} {}
          {msg.value !== undefined && `> ${msg.value}`}
        </p>
      ))}
    </div>
  );
}
