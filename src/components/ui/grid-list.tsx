'use client'

import type React from 'react'

import type { GridListItemProps, GridListProps } from 'react-aria-components'
import { IconHamburger } from '@intentui/icons'
import {
  Button,
  composeRenderProps,
  GridListItem as GridListItemPrimitive,
  GridList as GridListPrimitive,
} from 'react-aria-components'
import { twMerge } from 'tailwind-merge'

import { tv } from 'tailwind-variants'
import { Checkbox } from './checkbox'
import { composeTailwindRenderProps } from './primitive'

function GridList<T extends object>({ children, className, ...props }: GridListProps<T>) {
  return (
    <GridListPrimitive
      className={composeTailwindRenderProps(
        className,
        'relative max-h-96 overflow-auto rounded-lg border [scrollbar-width:thin] *:data-drop-target:border *:data-drop-target:border-accent [&::-webkit-scrollbar]:size-0.5',
      )}
      {...props}
    >
      {children}
    </GridListPrimitive>
  )
}

const itemStyles = tv({
  base: 'group -mb-px -outline-offset-2 relative flex cursor-default select-none gap-3 border-y px-3 py-2 text-fg outline-hidden transition [--selected-item-hovered:theme(--color-muted/70%)] [--selected-item:theme(--color-muted/80%)] first:rounded-t-md first:border-t-0 last:mb-0 last:rounded-b-md last:border-b-0 sm:text-sm',
  variants: {
    isHovered: { true: 'bg-subtle' },
    isSelected: {
      true: 'z-20 border-border/50 bg-(--selected-item) hover:bg-(--selected-item-hovered)',
    },
    isFocused: {
      true: 'outline-hidden',
    },
    isFocusVisible: {
      true: 'bg-(--selected-item) selected:bg-(--selected-item) outline-hidden ring-1 ring-ring hover:bg-(--selected-item-hovered)',
    },
    isDisabled: {
      true: 'text-muted-fg/70 forced-colors:text-[GrayText]',
    },
  },
})

function GridListItem({ className, ...props }: GridListItemProps) {
  const textValue = typeof props.children === 'string' ? props.children : undefined
  return (
    <GridListItemPrimitive
      textValue={textValue}
      {...props}
      className={composeRenderProps(className, (className, renderProps) =>
        itemStyles({ ...renderProps, className }))}
    >
      {values => (
        <>
          {values.allowsDragging && (
            <Button
              slot="drag"
              className="cursor-grab data-dragging:cursor-grabbing *:data-[slot=icon]:text-muted-fg"
            >
              <IconHamburger />
            </Button>
          )}

          <span
            aria-hidden
            className="absolute inset-y-0 left-0 hidden h-full w-0.5 bg-primary group-selected:block"
          />
          {values.selectionMode === 'multiple' && values.selectionBehavior === 'toggle' && (
            <Checkbox className="-mr-2" slot="selection" />
          )}
          {typeof props.children === 'function' ? props.children(values) : props.children}
        </>
      )}
    </GridListItemPrimitive>
  )
}

function GridEmptyState({ ref, className, ...props }: React.ComponentProps<'div'>) {
  return <div ref={ref} className={twMerge('p-6', className)} {...props} />
}

GridList.Item = GridListItem
GridList.EmptyState = GridEmptyState

export type { GridListItemProps, GridListProps }
export { GridList }
