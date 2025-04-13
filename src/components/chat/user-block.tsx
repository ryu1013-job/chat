import React from 'react'

export default function UserBlock({ text }: { text: string }) {
  return (
    <div>
      <p className='text-fg/60' >{text}</p>
    </div>
  )
}
