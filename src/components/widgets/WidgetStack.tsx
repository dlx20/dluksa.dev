"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import type { Weather } from "@/lib/weather";
import { setWidgets, useWidgets, WIDGET_IDS, type WidgetId } from "@/lib/widgets";
import { WIDGETS } from "./registry";

// Space between widgets in px, matching gap-2
const GAP = 8;
// How close to the top or bottom edge a drag has to get to scroll the list
const EDGE = 32;

type Drag = {
  from: number;
  // Where the widget would land if dropped now
  to: number;
  // How far it has been dragged, including any scrolling
  dy: number;
  startY: number;
  startScroll: number;
  // Each widget's position and height when the drag began
  tops: number[];
  heights: number[];
};

const moveItem = <T,>(list: T[], from: number, to: number) => {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

type WidgetStackProps = {
  // True while the drawer is open
  active: boolean;
  weather: Promise<Weather | null>;
};

// The menu's widgets: drag a header to reorder, or focus its grip and use
// the arrow keys. Removed widgets go back into the add list
export default function WidgetStack({ active, weather }: WidgetStackProps) {
  const widgets = useWidgets();
  const [drag, setDrag] = useState<Drag | null>(null);
  const [picking, setPicking] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  // What gets focus once the list re-renders: a widget's grip after a
  // keyboard move, or the add button after a removal
  const refocus = useRef<WidgetId | "add" | null>(null);

  // The latest drag, for the pointer handlers. Pointer events can arrive
  // faster than React re-renders, so the state copy can be a step behind
  const dragRef = useRef<Drag | null>(null);
  const updateDrag = (next: Drag | null) => {
    dragRef.current = next;
    setDrag(next);
  };

  const scrollRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef(new Map<WidgetId, HTMLLIElement>());
  const gripRefs = useRef(new Map<WidgetId, HTMLButtonElement>());
  const addRef = useRef<HTMLButtonElement>(null);

  const available = WIDGET_IDS.filter((id) => !widgets.includes(id));

  // Moving or removing an element can drop focus, so place it once the list
  // has updated
  useEffect(() => {
    const target = refocus.current;
    if (!target) return;
    refocus.current = null;
    (target === "add" ? addRef.current : gripRefs.current.get(target))?.focus();
  }, [widgets]);

  const reorder = (from: number, to: number) => {
    if (to < 0 || to >= widgets.length || to === from) return;
    const id = widgets[from];
    setWidgets(moveItem(widgets, from, to));
    setAnnouncement(
      `${WIDGETS[id].name} moved to position ${to + 1} of ${widgets.length}`,
    );
    return id;
  };

  const add = (id: WidgetId) => {
    setWidgets([...widgets, id]);
    setPicking(false);
    setAnnouncement(`${WIDGETS[id].name} added`);
  };

  const remove = (id: WidgetId) => {
    refocus.current = "add";
    setWidgets(widgets.filter((w) => w !== id));
    setAnnouncement(`${WIDGETS[id].name} removed`);
  };

  const handleGripKey = (e: KeyboardEvent, index: number) => {
    const step = e.key === "ArrowUp" ? -1 : e.key === "ArrowDown" ? 1 : 0;
    if (!step) return;
    e.preventDefault();
    refocus.current = reorder(index, index + step) ?? null;
  };

  const startDrag = (e: PointerEvent<HTMLDivElement>, index: number) => {
    if (e.button !== 0 || widgets.length < 2) return;
    // Let the remove button and credit link handle their own clicks
    if ((e.target as HTMLElement).closest("[data-no-drag]")) return;

    const scroller = scrollRef.current;
    const items = widgets.map((id) => itemRefs.current.get(id));
    if (!scroller || items.some((item) => !item)) return;

    e.currentTarget.setPointerCapture(e.pointerId);
    updateDrag({
      from: index,
      to: index,
      dy: 0,
      startY: e.clientY,
      startScroll: scroller.scrollTop,
      tops: items.map((item) => item!.offsetTop),
      heights: items.map((item) => item!.offsetHeight),
    });
  };

  const moveDrag = (e: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const scroller = scrollRef.current;
    if (!drag || !scroller) return;

    // Scroll when the pointer nears the top or bottom edge
    const box = scroller.getBoundingClientRect();
    if (e.clientY < box.top + EDGE) scroller.scrollTop -= 8;
    else if (e.clientY > box.bottom - EDGE) scroller.scrollTop += 8;

    const { from, tops, heights } = drag;
    const last = tops.length - 1;
    const moved = e.clientY - drag.startY + scroller.scrollTop - drag.startScroll;
    // Keep the widget between the top of the first and bottom of the last
    const dy = Math.min(
      Math.max(moved, tops[0] - tops[from]),
      tops[last] + heights[last] - tops[from] - heights[from],
    );
    // Moving down, it passes a widget once its bottom edge crosses that
    // widget's middle; moving up, once its top edge does. Comparing edges
    // works for any mix of heights
    const top = tops[from] + dy;
    const bottom = top + heights[from];
    let to = from;
    tops.forEach((otherTop, i) => {
      const middle = otherTop + heights[i] / 2;
      if (i > from && bottom > middle) to++;
      if (i < from && top < middle) to--;
    });

    updateDrag({ ...drag, dy, to });
  };

  const endDrag = () => {
    const drag = dragRef.current;
    if (!drag) return;
    reorder(drag.from, drag.to);
    updateDrag(null);
  };

  // How far to shift each widget while dragging: the dragged one follows the
  // pointer, and the ones it passes slide over to make room
  const offset = (index: number) => {
    if (!drag) return 0;
    if (index === drag.from) return drag.dy;
    const room = drag.heights[drag.from] + GAP;
    if (drag.from < drag.to && index > drag.from && index <= drag.to) return -room;
    if (drag.from > drag.to && index >= drag.to && index < drag.from) return room;
    return 0;
  };

  return (
    <div
      ref={scrollRef}
      className="-mx-1 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-1 pb-1"
    >
      <ul aria-label="Widgets" className="relative flex flex-col gap-2">
        {widgets.map((id, index) => {
          const { name, title, credit, render } = WIDGETS[id];
          const dragging = drag?.from === index;
          return (
            <li
              key={id}
              ref={(item) => {
                if (!item) return;
                itemRefs.current.set(id, item);
                return () => {
                  itemRefs.current.delete(id);
                };
              }}
              style={{ transform: `translateY(${offset(index)}px)` }}
              className={`rounded-card border bg-surface-base/40 ${
                dragging
                  ? "relative z-10 border-accent/50 shadow-lg shadow-black/40"
                  : "border-accent/15"
              } ${drag && !dragging ? "transition-transform duration-150 ease-out" : ""}`}
            >
              {/* Header: drag it anywhere, or use the grip with the keyboard */}
              <div
                onPointerDown={(e) => startDrag(e, index)}
                onPointerMove={moveDrag}
                onPointerUp={endDrag}
                onPointerCancel={() => updateDrag(null)}
                className={`flex touch-none select-none items-center gap-2 border-b border-accent/10 px-2 py-1 text-ui text-fg-muted ${
                  dragging ? "cursor-grabbing" : "cursor-grab"
                }`}
              >
                <button
                  ref={(grip) => {
                    if (!grip) return;
                    gripRefs.current.set(id, grip);
                    return () => {
                      gripRefs.current.delete(id);
                    };
                  }}
                  type="button"
                  aria-label={`Move ${name}. Use the up and down arrow keys`}
                  onKeyDown={(e) => handleGripKey(e, index)}
                  className="cursor-[inherit] transition-colors hover:text-accent"
                >
                  ⠿
                </button>
                <span className="min-w-0 flex-1 truncate">{title}</span>
                {credit && (
                  <a
                    data-no-drag
                    href={credit.href}
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:text-accent"
                  >
                    {credit.label}
                  </a>
                )}
                <button
                  data-no-drag
                  type="button"
                  aria-label={`Remove ${name}`}
                  onClick={() => remove(id)}
                  className="cursor-pointer px-1 transition-colors hover:text-accent"
                >
                  ×
                </button>
              </div>
              <div className="p-2">{render({ active, weather })}</div>
            </li>
          );
        })}
      </ul>

      {/* Add a widget that isn't showing yet */}
      {available.length > 0 &&
        (picking ? (
          <div className="flex flex-col gap-2 rounded-card border border-dashed border-accent/30 p-2 text-ui">
            <div className="flex items-center justify-between text-fg-muted">
              add widget
              <button
                type="button"
                aria-label="Cancel adding a widget"
                onClick={() => setPicking(false)}
                className="cursor-pointer px-1 transition-colors hover:text-accent"
              >
                ×
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {available.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => add(id)}
                  className="btn px-2 text-ui"
                >
                  + {WIDGETS[id].name}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <button
            ref={addRef}
            type="button"
            onClick={() => setPicking(true)}
            className="cursor-pointer rounded-card border border-dashed border-accent/25 py-2 text-ui text-fg-muted transition-colors hover:border-accent/50 hover:text-accent"
          >
            + add widget
          </button>
        ))}

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}
