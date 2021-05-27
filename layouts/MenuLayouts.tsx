import React from 'react';
import styles from './class.module.css';

import Router from 'next/router';
import { Clsx } from '@components/core';
import { observer } from 'mobx-react-lite';
import { RootStore } from '@store/RootStore';

export const MenuLayouts = React.memo<any>(observer((props) => {
  React.useEffect(() => {
    const menu = RootStore['menu']['left'];
    RootStore['menu'].setSelectRow({menu: menu, router: Router});
  }, []);

  return (
    <div className={Clsx(styles['menu-layouts'])}>
      <div>
        {RootStore['menu']['left'].map((row, index) => {
          const onClick = () => Router.push({pathname: row['link']});
          return (
            <div key={index} className={styles['row']} onClick={()=>onClick()} data-select={row['select']}>
              <div>{row['icon']}</div> <div>{row['label']}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}));