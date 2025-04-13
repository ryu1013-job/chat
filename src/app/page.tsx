'use client';

import { useChat } from '@ai-sdk/react';
import { IconSend2, IconSend2Fill } from '@intentui/icons';
import Messages from '~/components/chat/messages';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { Input } from '~/components/ui/field';
import { TextField } from '~/components/ui/text-field';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    maxSteps: 3,
  });
  return (
    <div className="grid grid-rows-[10px_1fr_10px] items-center justify-items-center min-h-dvh py-10 px-6 gap-16">
      <header>
        ryu
      </header>
      <Card className='max-w-xl w-full shadow-xl'>
        <Card.Header>
          <Card.Title>ryu chat</Card.Title>
          <Card.Description>Ask me anything about ryu!</Card.Description>
        </Card.Header>
        <Card.Content className="space-y-2">
          {messages.map(m => (
            <Messages key={m.id} {...m} />
          ))}
        </Card.Content>
        <Card.Footer>
          <form onSubmit={handleSubmit} className='w-full'>
            <TextField
              autoFocus
              value={input}
              placeholder="What is your favorite food?"
              onChange={(value: string) => handleInputChange({ target: { value } } as React.ChangeEvent<HTMLInputElement>)}
              suffix={
                <Button aria-label="Send message" type='submit'>
                  <IconSend2Fill />
                </Button>
              }
            />
          </form>
        </Card.Footer>
      </Card>
      <footer>
        ryu
      </footer>
    </div>
  );
}