export * from './tabs-root'
export * from './tabs-list'
export * from './tab-trigger'
export * from './tab-content'


/**
 * TabRoot props
 * direction 'rtl' | 'ltr'
 * orientation 'horizontal' | 'vertical'
 * default-value string
 *
 * aria attributes
 * role 'tabs'
 *
 * TabRoot event
 * (change) => string
 */

/**
 * TabList props
 *
 * aria attributes
 * role 'tablist'
 *
 * data attributes
 */


/**
 * TabTrigger props
 * value string
 * disabled boolean
 *
 * aria attributes
 * role 'tab'
 * aria-controls
 * aria-selected boolean
 * tabindex 0 | -1
 *
 * data attributes
 * [data-state] 'active' | 'inactive'
 */

/**
 * TabContent props
 * value string
 *
 * aria attributes
 * role 'tabpanel'
 * aria-labelledBy
 *
 * data attributes
 * hidden boolean
 * [data-state] 'active' | 'inactive'
 * hidden boolean
 */