/**
 * State for styling hooks
 */
export type AlertDialogState = "open" | "closed";

/**
 * Root context shared with all alert dialog components
 */
export interface AlertDialogRootContextValue {
  /** Current open state */
  open: boolean;
  /** State attribute for styling */
  stateAttribute: AlertDialogState;
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
  /** Reference to cancel button (for auto-focus) */
  cancelElement: HTMLElement | null;
  /** Open or close the dialog */
  onOpenChange: (open: boolean) => void;
  /** Called when trigger element mounts */
  onTriggerMount: (el: HTMLElement) => void;
  /** Called when content element mounts */
  onContentMount: (el: HTMLElement) => void;
  /** Called when cancel element mounts */
  onCancelMount: (el: HTMLElement) => void;
}

/**
 * Props for AlertDialogRoot
 */
export interface AlertDialogRootProps {
  /** Controlled open state */
  open?: boolean;
  /** Default open state for uncontrolled mode */
  defaultOpen?: boolean;
}

/**
 * Props for AlertDialogContent
 */
export interface AlertDialogContentProps {
  /** Whether to force-mount the content */
  forceMount?: boolean;
}

/**
 * Props for AlertDialogPortal
 */
export interface AlertDialogPortalProps {
  /** Container element or selector to portal into */
  container?: string | HTMLElement;
  /** Whether to force-mount the portal content */
  forceMount?: boolean;
}

/**
 * Props for AlertDialogOverlay
 */
export interface AlertDialogOverlayProps {
  /** Whether to force-mount the overlay */
  forceMount?: boolean;
}
