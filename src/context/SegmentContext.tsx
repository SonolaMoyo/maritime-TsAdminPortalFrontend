import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { SegmentType } from '../data/mockRequests';

export type ExtendedSegmentType = SegmentType | 'All';

interface SegmentContextType {
  segment: ExtendedSegmentType;
  setSegment: (segment: ExtendedSegmentType) => void;
}

const SegmentContext = createContext<SegmentContextType | undefined>(undefined);

export function SegmentProvider({ children }: { children: ReactNode }) {
  const [segment, setSegment] = useState<ExtendedSegmentType>('All');

  return (
    <SegmentContext.Provider value={{ segment, setSegment }}>
      {children}
    </SegmentContext.Provider>
  );
}

export function useSegment() {
  const context = useContext(SegmentContext);
  if (context === undefined) {
    throw new Error('useSegment must be used within a SegmentProvider');
  }
  return context;
}
