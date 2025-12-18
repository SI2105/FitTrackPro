'use client'
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

import { 
  Dumbbell, 
  Calendar, 
  LogOut,
  Home,
  Activity
} from 'lucide-react';

interface NavLink {
  name: string
  path: string
  icon: React.ComponentType<{ className: string }>
}

const navlinks: NavLink[] = [
  { name: "Dashboard", path: "/dashboard", icon: Home },
  { name: "Workouts", path: "/workouts", icon: Calendar },
  { name: "Exercises", path: "/exercises", icon: Activity }
]







export default function Navbar({ handleLogout }: {handleLogout: () => void}) {
    

    return ( <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Dumbbell className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">FitTrackPro</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navlinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.path}
                      href={link.path}
                      className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    >
                      <Icon className="h-4 w-4 mr-1" />
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
    )
}