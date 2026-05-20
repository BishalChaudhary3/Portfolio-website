// context/VisitorContext.jsx
'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const VisitorContext = createContext();

export function VisitorProvider({ children }) {
  const [visitorCount, setVisitorCount] = useState({ total: 0, today: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisitorCount();
  }, []);

  const fetchVisitorCount = async () => {
    try {
      const response = await fetch('/api/visitor');
      const data = await response.json();
      setVisitorCount(data);
    } catch (error) {
      console.error('Error fetching visitor count:', error);
    } finally {
      setLoading(false);
    }
  };

  const incrementVisitor = async () => {
    try {
      await fetch('/api/visitor', { method: 'POST' });
      fetchVisitorCount(); // Refresh count
    } catch (error) {
      console.error('Error incrementing visitor:', error);
    }
  };

  return (
    <VisitorContext.Provider value={{ visitorCount, loading, incrementVisitor, refreshCount: fetchVisitorCount }}>
      {children}
    </VisitorContext.Provider>
  );
}

export const useVisitor = () => {
  const context = useContext(VisitorContext);
  if (!context) {
    throw new Error('useVisitor must be used within a VisitorProvider');
  }
  return context;
};