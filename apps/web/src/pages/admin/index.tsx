import React from 'react';
import loadable from '@loadable/component';
import { LoadingPage } from '../../components';

export const AdminRoot = loadable(() => import('./root'), {
  fallback: <LoadingPage />,
});
