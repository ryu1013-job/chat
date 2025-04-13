'use client'

import type { UseEmblaCarouselType } from 'embla-carousel-react'
import type { HTMLAttributes } from 'react'

import type { ListBoxItemProps, ListBoxSectionProps } from 'react-aria-components'
import type { ButtonProps } from './button'
import { IconChevronLgLeft, IconChevronLgRight } from '@intentui/icons'
import useEmblaCarousel from 'embla-carousel-react'

import { createContext, use, useCallback, useEffect, useState } from 'react'
import {
  ListBox,
  ListBoxItem,

  ListBoxSection,

} from 'react-aria-components'
import { twJoin, twMerge } from 'tailwind-merge'
import { Button } from './button'
import { composeTailwindRenderProps } from './primitive'

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselProps

const CarouselContext = createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = use(CarouselContext)

  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />')
  }

  return context
}

interface CarouselRootProps {
  CarouselContent?: typeof CarouselContent
  CarouselHandler?: typeof CarouselHandler
  CarouselItem?: typeof CarouselItem
  CarouselButton?: typeof CarouselButton
}

interface CarouselProps extends HTMLAttributes<HTMLDivElement>, CarouselRootProps {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: 'horizontal' | 'vertical'
  setApi?: (api: CarouselApi) => void
}

function Carousel({
  orientation = 'horizontal',
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}: CarouselProps) {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === 'horizontal' ? 'x' : 'y',
    },
    plugins,
  )
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const onSelect = useCallback((api: CarouselApi) => {
    if (!api) {
      return
    }

    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())
  }, [])

  const scrollPrev = useCallback(() => {
    api?.scrollPrev()
  }, [api])

  const scrollNext = useCallback(() => {
    api?.scrollNext()
  }, [api])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        scrollPrev()
      }
      else if (event.key === 'ArrowRight') {
        event.preventDefault()
        scrollNext()
      }
    },
    [scrollPrev, scrollNext],
  )

  useEffect(() => {
    if (!api || !setApi) {
      return
    }

    setApi(api)
  }, [api, setApi])

  useEffect(() => {
    if (!api) {
      return
    }

    onSelect(api)
    api.on('reInit', onSelect)
    api.on('select', onSelect)

    return () => {
      api?.off('select', onSelect)
    }
  }, [api, onSelect])

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api,
        opts,
        orientation: orientation || (opts?.axis === 'y' ? 'vertical' : 'horizontal'),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <div
        onKeyDownCapture={handleKeyDown}
        className={twMerge('relative', className)}
        role="region"
        aria-roledescription="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

function CarouselContent<T extends object>({ className, ...props }: ListBoxSectionProps<T>) {
  const { carouselRef, orientation } = useCarousel()

  return (
    <ListBox
      layout={orientation === 'vertical' ? 'stack' : 'grid'}
      aria-label="Slides"
      orientation={orientation}
      ref={carouselRef}
      className="overflow-hidden"
    >
      <ListBoxSection
        className={twMerge(
          'flex',
          orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col',
          className,
        )}
        {...props}
      />
    </ListBox>
  )
}

function CarouselItem({ className, ...props }: ListBoxItemProps) {
  const { orientation } = useCarousel()

  return (
    <ListBoxItem
      aria-label={`Slide ${props.id}`}
      aria-roledescription="slide"
      className={composeTailwindRenderProps(
        className,
        twJoin(
          'xd24r group relative min-w-0 shrink-0 grow-0 basis-full focus:outline-hidden focus-visible:outline-hidden',
          orientation === 'horizontal' ? 'pl-4' : 'pt-4',
        ),
      )}
      {...props}
    />
  )
}

function CarouselHandler({ ref, className, ...props }: React.ComponentProps<'div'>) {
  const { orientation } = useCarousel()
  return (
    <div
      data-slot="carousel-handler"
      ref={ref}
      className={twMerge(
        'relative z-10 mt-6 flex items-center gap-x-2',
        orientation === 'horizontal' ? 'justify-end' : 'justify-center',
        className,
      )}
      {...props}
    />
  )
}

function CarouselButton({
  segment,
  className,
  intent = 'outline',
  shape = 'circle',
  size = 'square-petite',
  ref,
  ...props
}: ButtonProps & { segment: 'previous' | 'next' }) {
  const { orientation, scrollPrev, canScrollPrev, scrollNext, canScrollNext } = useCarousel()
  const isNext = segment === 'next'
  const canScroll = isNext ? canScrollNext : canScrollPrev
  const scroll = isNext ? scrollNext : scrollPrev
  const Icon = isNext ? IconChevronLgRight : IconChevronLgLeft

  return (
    <Button
      aria-label={isNext ? 'Next slide' : 'Previous slide'}
      data-handler={segment}
      intent={intent}
      ref={ref}
      size={size}
      shape={shape}
      className={composeTailwindRenderProps(
        className,
        orientation === 'vertical' ? 'rotate-90' : '',
      )}
      isDisabled={!canScroll}
      onPress={scroll}
      {...props}
    >
      <Icon className="size-4" />
    </Button>
  )
}

Carousel.Content = CarouselContent
Carousel.Handler = CarouselHandler
Carousel.Item = CarouselItem
Carousel.Button = CarouselButton

export type { CarouselApi }
export { Carousel, CarouselButton, CarouselContent, CarouselHandler, CarouselItem }
