import { focusRingRecipe } from "../recipes/focus-ring.recipe";
import { cn } from "../utils/cn";

/**
 * The classes of every splitter handle of the kit (rulebook T13): the handle
 * between two panels, ResizableHandle, and a resizable SidebarRail on the
 * Sidebar's edge. `sp-splitter-handle` takes the look of "The splitter handle"
 * in design-rework.css: the line at rest, the 3 px band under the pointer and
 * while it drags, the 8 px grab area and the resize cursor.
 *
 * The keyboard focus is the kit ring in its inset form, drawn inside a 5 px
 * box that the stylesheet gives an inset handle, so it reads as one bar along
 * the edge. `focusRingRecipe()` here instead draws the ring outside a handle
 * as wide as the ring, with no other change.
 */
export const splitterHandleClassName: string = cn(
  "sp-splitter-handle",
  focusRingRecipe({ inset: true }),
);
