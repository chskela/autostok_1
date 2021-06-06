import React from 'react';
import Router from 'next/router';
import styles from './class.module.css';

import { useRouter } from 'next/router';
import Image from 'next/image';
import { observer } from 'mobx-react-lite';

import { Clsx } from '@components/core';
import { MuiTextField, MuiButton } from '@components/core';
import { MuiScrollbar, MuiSkeleton } from '@components/core';
import { PaperclipIcon, Navigation2 } from '@components/icons';

import moment from 'moment';
import arrayMove from 'array-move';
import { LazyImage } from 'react-lazy-images';
import SortableList, { SortableItem } from 'react-easy-sort';
import SimpleReactLightbox, { SRLWrapper } from 'simple-react-lightbox';

import { RootStore } from '@store/RootStore';
import { useDropzone } from 'react-dropzone';
import { applySnapshot } from 'mobx-state-tree';


import { DirectList } from '@models/direct/DirectList';
import { DirectTypingModel } from '@models/direct/DirectModel';
import { DirectMessagesList } from '@models/direct/DirectList';

export const PageDirect = observer((props) => {
  const router = useRouter();
  const refSrollBar = React.useRef(null);
  const [model] = React.useState(DirectTypingModel.create());
  const onDrop = React.useCallback(files => { model.addStorage(files)}, []);
  const [direct] = React.useState(DirectList.create({ ...props['direct'] }));
  React.useEffect(() => { applySnapshot(direct, { ...props['direct'] }) }, [props]);
  const [messages] = React.useState(DirectMessagesList.create({ ...props['messages'] }));
  React.useEffect(() => {
    applySnapshot(messages, { ...props['messages'] })
    const scroll = setInterval(() => {
      if (refSrollBar['current']['scrollValues']['scrollTop'] === 0) {
        refSrollBar['current'].scrollToBottom();
      } else {
        clearInterval(scroll);
      }
    }, 0);
  }, [props]);
  const { open, getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDrop, noClick: true, accept: ['image/png', 'image/jpg', 'image/jpeg'], multiple: true
  });
  const onSortEnd = (from: number, to: number) => {model.changeControl('storage', arrayMove(model['storage'], from, to))};
  
  return (

      <div className={styles['container']}>
        <div className={styles['row']}>
          <div className={styles['direct']}>

            <div className={styles['direct-title']}>{'Сообщения'}</div>

            <MuiScrollbar>
              
              {direct['response'].map((row, index) => {
                const image = row['reception_parts'].getPreview();
                const onClick = () => Router.push({pathname: router['pathname'], query: {select: row['id']}});

                return (
                  <div key={index} onClick={onClick} className={styles['direct-item']}>
                    
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
                );
              })}

            </MuiScrollbar>
            <MuiButton
              label={'Загрузить еще'}
              loading={model['isFetching']}
              className={styles['direct-button']}
              onClick={() => {
                const paginator = direct['paginator'];
                const page = direct['paginator']['page'];
                !paginator.isLast() && (direct['paginator'].changeControl('page', page + 1), direct.loadMoreModel({}))
              }}
            />
          </div>
          
        <div className={styles['messages']}>
          
            <SimpleReactLightbox>
              <MuiScrollbar ref={refSrollBar}>

                {messages['response'].map((row, index) => {
                  
                  const image = row['sender'].getPreview();
                  const isUser = RootStore['session']['user']['id'] === row['sender']['id'];
                  const isLast = row['sender']['id'] !== messages['response'][index + 1]?.['sender']['id'];
                  const classTime = Clsx(styles['time'], {[styles['time-right']]: isUser, [styles['time-left']]: !isUser});
                  const classAvatar = Clsx(styles['avatar'], {[styles['avatar-right']]: isUser, [styles['avatar-left']]: !isUser});
                  const classCompany = Clsx(styles['company'], {[styles['company-right']]: isUser, [styles['company-left']]: !isUser});
                  const classMessage = Clsx(styles['message'], {[styles['message-right']]: isUser, [styles['message-left']]: !isUser, [styles['message-islast']]: !isLast});
                  
                  const storageLength = row['storage']['length'];

                  return (
                    <div key={index} data-sender={isUser} className={classMessage}>
                    
                      {storageLength > 0 ?
                        <SRLWrapper>
                        <div className={styles['thumbs-container']}>
                          
                            {row['storage'].map((file, i) => {
                              const classImage = Clsx(i < 2 ? styles['thumb-large'] : styles['thumb-small']);
                              const classImageActual =  Clsx(classImage, (storageLength > 5 && i === 4) && styles['thumb-plus'])
                              return i < 5 ? (
                          
                                <LazyImage
                                  key={file['file_id']}
                                  debounceDurationMs={300}
                                  src={file['public_url']}
                                  placeholder={({ ref }) => (
                                    <div ref={ref} className={classImage}>
                                      <MuiSkeleton className={styles['img-skeleton']}/>
                                    </div>
                                  )}
                                  actual={({ imageProps }) => (
                                    <div className={classImageActual}>
                                      <img {...imageProps} className={Clsx(styles['img-previews'],'animated fadeIn')}/>
                                    </div>
                                  )}
                                />

                              ) : null})}

                        </div>
                        </SRLWrapper>
                      : null}
                      
                      <div className={styles['message-content']}>{row['content']}</div>

                      <div className={classAvatar}>
                        {image ? <img src={image} className={styles['img']}/> : <div className={styles['avatar-placeholder']}></div>}
                      </div>

                      <div className={classCompany}>
                        {row['sender']['first_name']}
                      </div>

                      <div className={classTime}>
                        {moment((row['date_send'])).locale('ru').format('HH:mm')}
                      </div>
                    </div>
                  );
                })}

              </MuiScrollbar>
            </SimpleReactLightbox>
            <div className={styles['input']}>

              <input {...getInputProps()} />

              <MuiTextField
                value={model['content']}
                className={styles['textinput']}
                onChange={(value) => model.changeControl('content', value)}
              />

              <MuiButton
                onClick={open}
                icon={<PaperclipIcon size={'18px'}/>}
                className={styles['icon']}
              />

              <MuiButton
                label={'ОТПРАВИТЬ'}
                icon={<Navigation2 size={'16px'}/>}
                className={styles['button']}
                onClick={async () => {
                  if (!model['content'] && model['storage']['length'] === 0) return;
                  
                  model['direct'].changeControl('id', router['query']['select'])
                  const response = await model.createModel();

                  if (response['status'] === 200) {
                    model.changeControl('content', null);
                    model.changeControl('storage', []);
                    await Router.push({ pathname: router['pathname'], query: { ...router['query'] } });
                  }
                }}
              />

            </div>

            <div {...getRootProps({ className: `${styles['dropzone']} ${isDragActive ? styles['dropzone-active'] : ''}` })}>
              
              {model['storage']['length'] ? (
                <SortableList onSortEnd={onSortEnd} className={styles['dropzone-container']}>

                {model['storage'].map((file, i) =>  i < 5 ? 
                    
                  <SortableItem key={file['file_id']}>
                    <div className={styles['dropzone-thumb']} >
                      <img className={Clsx(styles['dropzone-img'],'animated fadeIn')} width={300} height={300} src={file['public_url']}/>
                    </div>
                  </SortableItem>

                : null)}

                </SortableList>
              ) : <span className={styles['dropzone-title']}>{'Перетащите сюда несколько файлов.'}</span>}

            </div>
          </div>
        </div>
      </div>
    
  );
});