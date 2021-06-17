import React from 'react';
import styles from './class.module.css';

import { Clsx } from '@components/core';
import { observer } from 'mobx-react-lite';
import { MuiSkeleton } from '@components/core';

import moment from 'moment';
import { RootStore } from '@store/RootStore';
import { LazyImage } from 'react-lazy-images';
import { SRLWrapper } from 'simple-react-lightbox';

export const MessageItem = React.memo<any>(observer(({ row, index, messages }) => {
  const image = row['sender'].getPreview();
  const storageLength = row['storage']['length'];
  const isUser = RootStore['session']['user']['id'] === row['sender']['id'];
  const isLast = row['sender']['id'] !== messages['response'][index + 1]?.['sender']['id'];
  const classTime = Clsx(styles['time'], { [styles['time-right']]: isUser, [styles['time-left']]: !isUser });
  const classAvatar = Clsx(styles['avatar'], { [styles['avatar-right']]: isUser, [styles['avatar-left']]: !isUser });
  const classCompany = Clsx(styles['company'], { [styles['company-right']]: isUser, [styles['company-left']]: !isUser });
  const classMessage = Clsx(styles['message'], { [styles['message-right']]: isUser, [styles['message-left']]: !isUser, [styles['message-islast']]: !isLast });
  const options = {
    buttons: {
      showAutoplayButton: false,
      showCloseButton: true,
      showDownloadButton: false,
      showFullscreenButton: false,
      showThumbnailsButton: false,
    },
    thumbnails: {
      showThumbnails: false,
    }
  };

  return (
    <div key={index} data-sender={isUser} className={classMessage}>
                    
      {storageLength > 0 ?
        <SRLWrapper options={options}>
          <div className={styles['thumbs-container']}>
                            
            {row['storage'].map((file, i) => {
              const classImage = Clsx(i < 2 ? styles['thumb-large'] : styles['thumb-small']);
              const classImageActual = Clsx(classImage, (storageLength > 5 && i === 4) && styles['thumb-plus'])
                              
              return i < 5 ? (
                          
                <LazyImage
                  key={file['file_id']}
                  debounceDurationMs={300}
                  src={file['public_url']}
                  placeholder={({ ref }) => (
                    <div ref={ref} className={classImage}>
                      <MuiSkeleton className={styles['img-skeleton']} />
                    </div>
                  )}
                  actual={({ imageProps }) => (
                    <div className={classImageActual}>
                      <img {...imageProps} className={Clsx(styles['img-previews'], 'animated fadeIn')} />
                    </div>
                  )}
                />

              ) : null
            })}

          </div>
        </SRLWrapper>
        : null}
                                            
      <div className={styles['message-content']}>{row['content']}</div>

      <div className={classAvatar}>
        {image ? <img src={image} className={styles['img']} /> : <div className={styles['avatar-placeholder']}></div>}
      </div>

      <div className={classCompany}>
        {row['sender']['first_name']}
      </div>

      <div className={classTime}>
        {moment((row['date_send'])).locale('ru').format('HH:mm')}
      </div>
    </div>
  )
}))