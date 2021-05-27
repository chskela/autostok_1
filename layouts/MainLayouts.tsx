import React from 'react';
import styles from './class.module.css';

import { Clsx } from '@components/core';
import { observer } from 'mobx-react-lite';
import { MenuLayouts } from './MenuLayouts';
import { ToolbarLayouts } from './ToolbarLayouts';

export const MainLayouts = React.memo<any>(observer((props) => {
  return (
    <div className={Clsx(styles['main-layouts'])}>
      <ToolbarLayouts/>

      <div className={styles['container']}>
        <div> <MenuLayouts/> </div>
        <div> {props['children']} </div>
      </div>
    </div>
  )
}));