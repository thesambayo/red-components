/**
 * Registers every Red Elements custom element for the docs site.
 *
 * Imported through Vite so bare specifiers (`lit`, `@red-elements/core`)
 * resolve and a single shared copy of Lit is bundled. The previous setup
 * served hand-copied bundles from `public/scripts/`, which went stale the
 * moment the packages changed - and could not work at all once Lit became
 * an external peer, since a plain <script type="module"> cannot resolve a
 * bare specifier.
 */
import "@red-elements/accordion/elements";
import "@red-elements/alert-dialog/elements";
import "@red-elements/avatar/elements";
import "@red-elements/combobox/elements";
import "@red-elements/dialog/elements";
import "@red-elements/dropdown/elements";
import "@red-elements/select/elements";
import "@red-elements/switch/elements";
import "@red-elements/tabs/elements";
import "@red-elements/toast/elements";
import "@red-elements/tooltip/elements";
