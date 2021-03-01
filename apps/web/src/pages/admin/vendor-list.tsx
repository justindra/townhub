import React, { useEffect } from 'react';
import { useTownhub } from '../../state';

export const VendorList: React.FC = () => {
  const { testAuth } = useTownhub();

  useEffect(() => {
    testAuth();
  }, []);

  return <div>Hellop</div>;
};
