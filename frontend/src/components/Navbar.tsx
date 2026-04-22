import { Link } from 'react-router-dom';
import { ClipboardCheck } from 'lucide-react';

import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from './ui/navigation-menu';

import { Button } from './ui/button';

import { useSignout } from '../hooks/useSignout';
import { useAuthContext } from '@/hooks/useAuthContext';

export function Navbar() {
  const { signout } = useSignout();

  const { user } = useAuthContext();

  const handleClick = () => {
    signout();
  };

  return (
    <div className="shadwo-xs border-b-1 flex w-full items-center justify-between border-gray-200 p-4">
      <span className="flex items-center gap-2">
        <ClipboardCheck size={30} />
        <span className="text-xl font-medium">Appstrack</span>
      </span>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem className="hidden md:block">
            {user && (
              <div>
                <span className="mr-2 text-black">{user.user?.name}</span>
                <Button onClick={handleClick}>Sign Out</Button>
              </div>
            )}
            {!user && (
              <div>
                <Button>
                  <Link to="/signin">Sign In</Link>
                </Button>
              </div>
            )}
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
