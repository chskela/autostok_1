import React from 'react';
import Router from 'next/router';
import styles from './class.module.css';

import { useRouter } from 'next/router';
import { observer } from 'mobx-react-lite';

import { Clsx } from '@components/core';
import { MuiScrollbar } from '@components/core';
import { MuiTextField, MuiButton } from '@components/core';
import { PaperclipIcon, Navigation2 } from '@components/icons';

import moment from 'moment';
import { RootStore } from '@store/RootStore';
import { useDropzone } from 'react-dropzone';
import { applySnapshot } from 'mobx-state-tree';

import { DirectList } from '@models/direct/DirectList';
import { DirectTypingModel } from '@models/direct/DirectModel';
import { DirectMessagesList } from '@models/direct/DirectList';

export const PageDirect = observer((props) => {
  const router = useRouter();
  const [model] = React.useState(DirectTypingModel.create());
  const [direct] = React.useState(DirectList.create({ ...props['direct'] }));
  React.useEffect(() => {applySnapshot(direct, { ...props['direct'] })}, [props]);
  React.useEffect(() => {applySnapshot(messages, { ...props['messages'] })}, [props]);
  const [messages] = React.useState(DirectMessagesList.create({ ...props['messages'] }));
  const {open, getRootProps, getInputProps, isDragAccept} = useDropzone({noClick: true, noKeyboard: true});

  return (
    <div className={styles['container']}>
      <div className={styles['row']}>
        <div className={styles['direct']}>

          <div className={styles['direct-title']}>{'Сообщения'}</div>

          <MuiScrollbar>
            
            {direct['response'].map((row, index) => {
              const onClick = () => Router.push({pathname: router['pathname'], query: {select: row['id']}});
              const image = row['reception_parts'].getPreview();
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
                      {`Вы: ${row['message']['content']}`}
                    </div>

                  </div>
                </div>
              );
            })}

          </MuiScrollbar>
          <MuiButton
            label={'Загрузить еще'}
            className={styles['direct-button']}
            onClick={async () => {}}
          />
        </div>
        
        <div className={styles['messages']}>

          <MuiScrollbar ref={ref => {ref && ref.scrollToBottom()}}>

            {messages['response'].map((row, index) => {

              const image = row['sender'].getPreview();
              const isUser = RootStore['session']['user']['id'] === row['sender']['id'];
              const isLast = row['sender']['id'] !== messages['response'][index + 1]?.['sender']['id'];
              const classTime = Clsx(styles['time'], {[styles['time-right']]: isUser, [styles['time-left']]: !isUser});
              const classAvatar = Clsx(styles['avatar'], {[styles['avatar-right']]: isUser, [styles['avatar-left']]: !isUser});
              const classCompany = Clsx(styles['company'], {[styles['company-right']]: isUser, [styles['company-left']]: !isUser});
              const classMessage = Clsx(styles['message'], {[styles['message-right']]: isUser, [styles['message-left']]: !isUser, [styles['message-islast']]: !isLast});

              return (
                <div key={index} data-sender={isUser} className={classMessage}>

                  {row['content']}

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
                model['direct'].changeControl('id', router['query']['select'])
                const response = await model.createModel();
                if (response['status'] === 200) {
                  model.changeControl('content', null);
                  await Router.push({ pathname: router['pathname'], query: { ...router['query'] } });
                }
              }}
            />

          </div>
          <div {...getRootProps({
              className: isDragAccept
                ? `${styles['dropzone']} absolute left-36 right-36 top-96 bottom-32`
                : 'absolute left-36 right-36 top-96 bottom-32 ',
            })}
          >
          </div>
        </div>
      </div>
    </div>
  );
});