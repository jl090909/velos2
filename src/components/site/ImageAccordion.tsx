'use client'

import { useId, useState, type ReactNode } from 'react'

/**
 * Image accordion - the pattern Apple uses on the iPad page (ImageAccordion): a list of headlines,
 * each with a chevron that flips, opening a tray of copy and imagery underneath. One item is open at a
 * time, the first by default.
 *
 * Kept from their markup: one <ul role="list"> of rows, a <button> inside the headline carrying
 * aria-expanded + aria-controls, the 17 x 8.85 chevron polyline, and a 320ms flip. The tray height
 * animates with grid-template-rows (0fr -> 1fr), which animates without measuring anything in JS, and
 * a closed tray is inert so its links and images cannot be tabbed into.
 *
 * Items are content, not markup: the caller passes the title and the already-rendered tray content.
 */

function Chevron() {
  return (
    <svg aria-hidden="true" className="h-[11px] w-[21px]" fill="none" viewBox="0 0 17 8.85">
      <polyline
        fill="none"
        points="15 1.13 8.5 7.72 2 1.13"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.1"
      />
    </svg>
  )
}

export type AccordionItem = {
  id: string
  title: string
  content: ReactNode
}

export function ImageAccordion({ items, defaultOpen = 0 }: { items: AccordionItem[]; defaultOpen?: number }) {
  const [open, setOpen] = useState<number | null>(defaultOpen)
  const base = useId()

  return (
    <ul className="m-0 list-none border-y border-[#003C64]/12 p-0" role="list">
      {items.map((item, index) => {
        const isOpen = open === index
        const trayId = `${base}-tray-${index}`
        return (
          <li className="border-b border-[#003C64]/12 last:border-b-0" key={item.id}>
            <h2 className="m-0">
              <button
                aria-controls={trayId}
                aria-expanded={isOpen}
                className="group flex w-full cursor-pointer items-center justify-between gap-6 border-0 bg-transparent py-7 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#003C64]/40"
                onClick={() => setOpen(isOpen ? null : index)}
                type="button"
              >
                <span className="text-[22px] font-semibold leading-[1.16] tracking-[-.04em] text-[#0A2231] transition-colors group-hover:text-[#003C64] md:text-[28px]">
                  {item.title}
                </span>
                <span
                  aria-hidden="true"
                  className={`shrink-0 text-[#0A2231]/80 transition-transform duration-[320ms] ease-[cubic-bezier(.12,0,.38,0)] ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                >
                  <Chevron />
                </span>
              </button>
            </h2>

            <div
              className={`grid transition-[grid-template-rows] duration-[420ms] ease-[cubic-bezier(.22,1,.36,1)] ${
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              }`}
              id={trayId}
              inert={isOpen ? undefined : true}
            >
              <div className="overflow-hidden">
                <div
                  className={`pt-1 pb-8 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                >
                  {item.content}
                </div>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
