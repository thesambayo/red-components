/**
 * Shared primitives for Red Elements components.
 *
 * Everything here was previously duplicated across the component packages and
 * had drifted apart between them.
 */
export { generateId } from "./generate-id";
export { attachBehavior, type BehaviorCleanup } from "./attach-behavior";
export { attachDismiss, type DismissOptions } from "./dismiss";
export {
  attachPopoverToggle,
  type PopoverToggleOptions,
  type ActivationSource,
} from "./popover-toggle";
export { dispatch, type NamespacedEventName } from "./dispatch";
export {
  ControlledState,
  type ControlledStateOptions,
} from "./controlled-state";
export {
  FloatingController,
  type FloatingControllerOptions,
  type Side,
  type Align,
} from "./floating-controller";
