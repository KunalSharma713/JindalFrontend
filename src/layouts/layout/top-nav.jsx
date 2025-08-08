import { Link } from 'react-router-dom'
import { IconMenu } from '@tabler/icons-react'
import { cn } from "../../lib/utils";
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function TopNav({ className, links, ...props }) {
  return (
    <>
      {/* Mobile Dropdown */}
      <div className='md:hidden'>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button size='icon' variant='outline'>
              <IconMenu />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side='bottom' align='start'>
            {links
              .filter(({ disabled }) => !disabled) // Remove disabled links from dropdown
              .map(({ title, href, isActive }) => (
                <DropdownMenuItem key={`${title}-${href}`} asChild>
                  <Link
                    to={href}
                    aria-current={isActive ? 'page' : undefined}
                    className={!isActive ? 'text-muted-foreground' : ''}
                  >
                    {title}
                  </Link>
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop Navigation */}
      <nav
        className={cn(
          'hidden items-center space-x-4 md:flex lg:space-x-6',
          className
        )}
        {...props}
      >
        {links.map(({ title, href, isActive, disabled }) => (
          <Link
            key={`${title}-${href}`}
            to={disabled ? '#' : href} // Prevent navigation for disabled links
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              isActive ? '' : 'text-muted-foreground',
              disabled && 'pointer-events-none opacity-50' // Make disabled links non-clickable
            )}
          >
            {title}
          </Link>
        ))}
      </nav>
    </>
  )
}
