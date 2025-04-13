import type { UIMessage } from 'ai'
import React from 'react'
import AssistantBlock from './assistant-block'
import UserBlock from './user-block'

export default function Messages(messages: UIMessage) {
  const { role, parts } = messages

  if (role === 'user' && parts[0].type === 'text') {
    return <UserBlock text={parts[0].text} />
  }

  return (
    <AssistantBlock message={messages} />
  )
}
