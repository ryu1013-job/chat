import { UIMessage } from 'ai'
import React from 'react'
import { Loader } from '../ui/loader';
import { IconCheck, IconCircleCheck } from '@intentui/icons';

export default function AssistantBlock({ message }: { message: UIMessage }) {
  return (
    <div>
      {message.parts.map((part, i) => {
        switch (part.type) {
          case "text": return <p key={i} className='mb-6'>{part.text}</p>;
          case "source": return <p key={i}>{part.source.url}</p>;
          case "reasoning": return <div key={i}>{part.reasoning}</div>;
          
          case "tool-invocation": return (
            <div key={i} className='flex items-center gap-2 text-fg/50'>
              {part.toolInvocation.state !== 'result' && <Loader />}
            </div>
          );
        }
      })}
    </div>
  )
}
