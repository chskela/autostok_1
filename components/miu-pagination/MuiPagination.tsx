import React from 'react';
import styles from './MuiPagination.useStyles.module.css';

import { Clsx } from 'components/core';
import { PaginationProps } from '@material-ui/lab';
import { Pagination, PaginationItem } from '@material-ui/lab';

interface IProps {
  onChange?: any;
  keyControl?: boolean;
  page?: PaginationProps['page'];
  pageTotal?: PaginationProps['count'];
  className?: PaginationProps['className'];
}

export const MuiPagination = React.memo<IProps>((props) => {
  React.useEffect(() => {
    if(props['keyControl']){
      document.addEventListener('keydown', keydown);  
      return () => document.removeEventListener('keydown', keydown);  
    }
  });
  
  const onChange = (page) => {
    if(props['onChange']){
      props.onChange(page);
    }
  }

  const keydown = (event) => {
    if(event['ctrlKey']){
      const page = props['page'];
      if(event['keyCode'] === 39){
        const setPage = page + 1;
        if(setPage <= props['pageTotal']){
          props.onChange(setPage);
        }
      }
      if(event['keyCode'] === 37){
        const setPage = page - 1;
        if(setPage >= 1){
          props.onChange(setPage);
        }
      }
    }
  }

  return (
    <Pagination
      page={props['page']}
      onChange={(event, page)=>onChange(page)}
      count={props['pageTotal'] ? props['pageTotal'] : 0}
      className={Clsx(styles['mui-pagination'], props['className'], 'pagin')}
      renderItem={(item) => <PaginationItem {...item} className={styles['item']} data-select={item['selected']}/>}
    />
  )
})