import React from 'react';
import styles from './class.module.css';

import { observer } from 'mobx-react-lite';
import { RootStore } from '@store/RootStore';

import { Clsx } from '@components/core';
import { Menu } from './ToolbarMenuStore';
import { GitIcon } from '@components/icons';
import { MuiPopover } from '@components/core';

//////////////////////////////
const MuiPopoverProps: any = {
  elevation: 0,
  marginThreshold: 0,
  className: styles['menu-popover'],
  anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
  transformOrigin: { vertical: 'top', horizontal: 'right' },
}
//////////////////////////////

export const ToolbarLayouts = React.memo<any>(observer((props) => {
  const user = RootStore['session']['user'];
  const [ openMenu, setOpenMenu ] = React.useState(null);

  return (
    <div className={Clsx(styles['toolbar-layouts'], 'h-[45px]')}>
      <div>
        <div className={styles['app-label']}>
          {'#AUTOSTOK'}
        </div>

        <div className={'flex items-center ml-auto'} onClick={(event)=>setOpenMenu(event['currentTarget'])}>
          <div className={styles['user-block']}>
            <GitIcon strokeWidth={2} size={'18px'} color={'#FFF'}/>
            <div className={styles['user-label']}>{user.getUserLabel()}</div>
          </div>
        </div>

        <MuiPopover {...MuiPopoverProps} open={openMenu} onClose={()=>setOpenMenu(null)}>
          {(Menu || []).map((row, index) => (
            <div className={styles['row']} key={index} onClick={()=>setOpenMenu(null)}>
              <div className={styles['icon']}>{row['icon']}</div>
              <div className={styles['label']}>{row['label']}</div>
            </div>
          ))}
        </MuiPopover>
      </div>
    </div>
  )
}));