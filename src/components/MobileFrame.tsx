import React, { ReactNode } from 'react';

interface MobileFrameProps {
  children: ReactNode;
}

const MobileFrame = ({ children }: MobileFrameProps) => {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
};

export default MobileFrame;
