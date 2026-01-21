/**
 * State for styling hooks
 */
export type DialogState = "open" | "closed";

/**
 * Root context shared with all dialog components
 */
export interface DialogRootContextValue {
  /** Current open state */
  open: boolean;
  /** State attribute for styling */
  stateAttribute: DialogState;
  /** Whether dialog is modal (traps focus, has overlay) */
  modal: boolean;
  /** Unique ID for content (for aria-labelledby) */
  contentId: string;
  /** Unique ID for title (for aria-labelledby) */
  titleId: string;
  /** Unique ID for description (for aria-describedby) */
  descriptionId: string;
  /** Reference to trigger element */
  trigger: HTMLElement | null;
  /** Reference to content element */
  contentElement: HTMLElement | null;
  /** Open or close the dialog */
  onOpenChange: (open: boolean) => void;
  /** Called when trigger element mounts */
  onTriggerMount: (el: HTMLElement) => void;
  /** Called when content element mounts */
  onContentMount: (el: HTMLElement) => void;
}

/**
 * Props for DialogRoot
 */
export interface DialogRootProps {
  /** Controlled open state */
  open?: boolean;
  /** Default open state for uncontrolled mode */
  defaultOpen?: boolean;
  /** Whether dialog is modal (default: true) */
  modal?: boolean;
}

/**
 * Props for DialogContent
 */
export interface DialogContentProps {
  /** Whether to force-mount the content */
  forceMount?: boolean;
}

/**
 * Props for DialogPortal
 */
export interface DialogPortalProps {
  /** Container element or selector to portal into */
  container?: string | HTMLElement;
  /** Whether to force-mount the portal content */
  forceMount?: boolean;
}

/**
 * Props for DialogOverlay
 */
export interface DialogOverlayProps {
  /** Whether to force-mount the overlay */
  forceMount?: boolean;
}
