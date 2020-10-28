import React from 'react';
import { Button, Map } from '../../components';
import { HorizontalList } from '../../components/horizontal-list';

export const ShuttleModule: React.FC = () => {
  return (
    <div>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#6c9867',
        }}>
        <Map />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: 0,
          right: 0,
        }}>
        <HorizontalList>
          <Button variant='contained' color='primary'>
            Test
          </Button>
          <Button variant='contained' color='primary'>
            Test
          </Button>
          <Button variant='contained' color='primary'>
            Test
          </Button>
          <Button variant='contained' color='primary'>
            Test
          </Button>
          <Button variant='contained' color='primary'>
            Test
          </Button>
        </HorizontalList>
      </div>
      hello
    </div>
  );
};
