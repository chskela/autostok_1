import React from 'react';
import Router from 'next/router';
import styles from './class.module.css';

import moment from 'moment';
import { useRouter } from 'next/router';
import { observer } from 'mobx-react-lite';

export const DirectItem = React.memo<any>(observer(({ row }) => {
  const router = useRouter();
  const image = row['reception_parts'].getPreview();
  const onClick = () => Router.push({pathname: router['pathname'], query: {select: row['id']}});

  return (
    <div onClick={onClick} className={styles['direct-item']}>
      
      <div className={styles['img-wrapper']}>
        <div className={styles['img-border']}>
          {image ? <img src={image} className={styles['img']}/> : <div className={styles['img-placeholder']}></div>}
        </div>
      </div>

      <div className={styles['content-wrapper']}>
        <div className={styles['meta']}>

          <div className={styles['meta-company']}>
            {'OOO AUTOSTOK'}
          </div>

          <div className={styles['meta-date']}>
            {moment(row['message']['date_send']).locale('ru').format('DD MMMM YYYY')}
          </div>

        </div>

        <div className={styles['part']}>
          {row['reception_parts']['part_category']['name']}
        </div>

        <div className={styles['last-message']}>
          {row['message']['content'] ? `Вы: ${row['message']['content']}` : 'В последнем сообщении только картинки.'}
        </div>

      </div>
    </div>
  )}))