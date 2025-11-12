import { Link } from '@inertiajs/react'
import { ModeToggle } from './toggle-theme'
import { GithubIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from './ui/button'

export default function Navbar() {
  return (
    <nav className="fixed top-0 border-0 w-full bg-background/90 backdrop-blur-md z-50">
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="flex items-center gap-3 justify-between h-[65px]">
          <Link href={'/'} className="font-bold text-lg">
            Task
            <span className="text-primary">Manager</span>
          </Link>
          <div className="flex items-center gap-3">
            <ModeToggle />
            <a
              href={'https://github.com/franckniat/adonis-todo'}
              target="_blank"
              className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}
            >
              <GithubIcon />
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
