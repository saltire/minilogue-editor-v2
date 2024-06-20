import { useEffect, useRef } from 'react';

import './MessageLog.css';
import { codes, messageTypes } from '../minilogue/midi';
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
          {msg.input || msg.targetId}: {}
          {messageTypes[msg.messageType] || msg.messageType} {}
          {codes[msg.code] || msg.code} {'> '}
          {msg.value}
        </p>
      ))}
    </div>
  );
}
