import * as Headless from '@headlessui/react'
import { Link as RouterLink, type LinkProps as RouterLinkProps } from 'react-router-dom'
import { forwardRef } from 'react'

// Define props that match Catalyst's Link API
interface CatalystLinkProps extends Omit<RouterLinkProps, 'to'> {
  href: string // Required href prop to match Catalyst's API
}

export const Link = forwardRef<HTMLAnchorElement, CatalystLinkProps>(function Link(
  { href, ...props },
  ref
) {
  return (
    <Headless.DataInteractive>
      <RouterLink {...props} to={href} ref={ref} />
    </Headless.DataInteractive>
  )
})