/**
 * Compile-time guard: every element class must satisfy `I extends HTMLElement`.
 *
 * @lit/react's `createComponent<I extends HTMLElement, E>` infers `I` from
 * `elementClass`. If a component declares a property incompatible with a native
 * one (e.g. `ariaLabel?: string` vs HTMLElement's `string | null`), inference
 * SILENTLY falls back to `I = HTMLElement` - no error at the call site - and
 * every custom prop vanishes from the React wrapper's types.
 *
 * That is exactly what `tooltip-content` did. This file makes it a build error.
 *
 * Generated shape; checked by `pnpm typecheck` against source (no build needed).
 */
type AssertElement<T extends HTMLElement> = T;

import type { AccordionContent, AccordionHeader, AccordionItem, AccordionRoot, AccordionTrigger } from "../packages/accordion/src/accordion";
type _accordion_AccordionContent = AssertElement<AccordionContent>;
type _accordion_AccordionHeader = AssertElement<AccordionHeader>;
type _accordion_AccordionItem = AssertElement<AccordionItem>;
type _accordion_AccordionRoot = AssertElement<AccordionRoot>;
type _accordion_AccordionTrigger = AssertElement<AccordionTrigger>;

import type { AlertDialogAction, AlertDialogCancel, AlertDialogRoot, AlertDialogTrigger } from "../packages/alert-dialog/src/alert-dialog";
type _alertdialog_AlertDialogAction = AssertElement<AlertDialogAction>;
type _alertdialog_AlertDialogCancel = AssertElement<AlertDialogCancel>;
type _alertdialog_AlertDialogRoot = AssertElement<AlertDialogRoot>;
type _alertdialog_AlertDialogTrigger = AssertElement<AlertDialogTrigger>;

import type { ComboboxAnchor, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxRoot, ComboboxTrigger } from "../packages/combobox/src/combobox";
type _combobox_ComboboxAnchor = AssertElement<ComboboxAnchor>;
type _combobox_ComboboxContent = AssertElement<ComboboxContent>;
type _combobox_ComboboxEmpty = AssertElement<ComboboxEmpty>;
type _combobox_ComboboxInput = AssertElement<ComboboxInput>;
type _combobox_ComboboxItem = AssertElement<ComboboxItem>;
type _combobox_ComboboxRoot = AssertElement<ComboboxRoot>;
type _combobox_ComboboxTrigger = AssertElement<ComboboxTrigger>;

import type { DialogClose, DialogRoot, DialogTrigger } from "../packages/dialog/src/dialog";
type _dialog_DialogClose = AssertElement<DialogClose>;
type _dialog_DialogRoot = AssertElement<DialogRoot>;
type _dialog_DialogTrigger = AssertElement<DialogTrigger>;

import type { TooltipArrow, TooltipContent, TooltipProvider, TooltipRoot, TooltipTrigger } from "../packages/tooltip/src/tooltip";
type _tooltip_TooltipArrow = AssertElement<TooltipArrow>;
type _tooltip_TooltipContent = AssertElement<TooltipContent>;
type _tooltip_TooltipProvider = AssertElement<TooltipProvider>;
type _tooltip_TooltipRoot = AssertElement<TooltipRoot>;
type _tooltip_TooltipTrigger = AssertElement<TooltipTrigger>;

