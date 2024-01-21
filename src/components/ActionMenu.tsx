import { ReactNode } from 'react';

import './ActionMenu.css';


type ActionMenuProps = {
  children: ReactNode,
};

export default function ActionMenu({ children }: ActionMenuProps) {
  return (
    <div className='action-menu'>
      {children}
    </div>
  );
}
