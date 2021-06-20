import React from 'react';

import { observer } from 'mobx-react-lite';
import { MuiScrollbar } from '@components/core';

import { DirectItem } from './direct-item/DirectItem';

export const DirectColumn = React.memo<any>(observer(({ direct }) => {

  return ( 
    <MuiScrollbar>
      {direct.map((row) => <DirectItem key={row['id']} row={row}/>)}
    </MuiScrollbar>
  )
}))