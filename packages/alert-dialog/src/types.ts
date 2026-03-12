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
  /** Reference to native dialog element */
  dialogElement: HTMLDialogElement | null;
  /** Generated ID for title element (for aria-labelledby) */
  titleId: string;
  /** Generated ID for description element (for aria-describedby) */
  descriptionId: string;
  /** Reference to trigger element (for returning focus) */
  triggerElement: HTMLElement | null;
  /** Reference to cancel element (for auto-focus) */
  cancelElement: HTMLElement | null;
  /** Open or close the dialog */
  onOpenChange: (open: boolean) => void;
  /** Called when trigger element mounts */
  onTriggerMount: (el: HTMLElement) => void;
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
 * Props for AlertDialogTrigger
 */
export interface AlertDialogTriggerProps {
  /** Pass behavior to slotted child instead of rendering wrapper */
  asChild?: boolean;
}

/**
 * Props for AlertDialogAction
 */
export interface AlertDialogActionProps {
  /** Pass behavior to slotted child instead of rendering wrapper */
  asChild?: boolean;
}

/**
 * Props for AlertDialogCancel
 */
export interface AlertDialogCancelProps {
  /** Pass behavior to slotted child instead of rendering wrapper */
  asChild?: boolean;
}
