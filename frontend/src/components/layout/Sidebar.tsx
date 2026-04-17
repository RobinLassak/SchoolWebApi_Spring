import { NavLink } from 'react-router-dom'
import { GraduationCap, Users, BookOpen, Star } from 'lucide-react'
import { cn } from '@/utils/cn'

const navigation = [
  { name: 'Studenti', href: '/students', icon: Users },
  { name: 'Předměty', href: '/subjects', icon: BookOpen },
  { name: 'Známky', href: '/grades', icon: Star },
]

export function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-sidebar flex flex-col z-30 select-none">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
          <GraduationCap size={20} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-white leading-tight">SchoolWeb</p>
          <p className="text-xs text-sidebar-text leading-tight">Správa školy</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="px-3 py-2 text-xs font-semibold text-sidebar-text/60 uppercase tracking-widest">
          Evidence
        </p>
        {navigation.map(({ name, href, icon: Icon }) => (
          <NavLink
            key={href}
            to={href}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-sidebar-active text-sidebar-textActive'
                  : 'text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-textActive'
              )
            }
          >
            <Icon size={18} />
            {name}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-white/10">
        <p className="text-xs text-sidebar-text/50 text-center">v1.0.0 &middot; SchoolWebApi</p>
      </div>
    </aside>
  )
}
