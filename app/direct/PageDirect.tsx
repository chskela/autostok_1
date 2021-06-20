import React from 'react';
import styles from './class.module.css';

import { useRouter } from 'next/router';
import { observer } from 'mobx-react-lite';
import { RootStore } from '@store/RootStore';

import { Clsx } from '@components/core';
import { MuiTextField, MuiButton } from '@components/core';
import { PaperclipIcon, Navigation2 } from '@components/icons';

import arrayMove from 'array-move';
import SortableList, { SortableItem } from 'react-easy-sort';

import { useDropzone } from 'react-dropzone';
import { applySnapshot } from 'mobx-state-tree';

import { DirectList } from '@models/direct/DirectList';
import { DirectTypingModel } from '@models/direct/DirectModel';
import { DirectMessagesList } from '@models/direct/DirectList';

import { DirectColumn } from './direct-column/DirectColumn';
import { MessagesList } from './messages-column/MessagesList';

export const PageDirect = React.memo<any>(observer((props) => {
  const router = useRouter();
  const [model] = React.useState(DirectTypingModel.create());
  const onDrop = React.useCallback(files => { model.addStorage(files)}, []);
  const [direct] = React.useState(DirectList.create({ ...props['direct'] }));
  React.useEffect(() => { applySnapshot(direct, { ...props['direct'] }) }, [props]);
  React.useEffect(() => {applySnapshot(messages, { ...props['messages'] })}, [props]);
  const [messages] = React.useState(DirectMessagesList.create({ ...props['messages'] }));
  
  const { open, getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDrop, noClick: true, accept: ['image/png', 'image/jpg', 'image/jpeg'], multiple: true
  });
  const onChange = React.useCallback((value) => model.changeControl('content', value), []);
  const onSortEnd = (from: number, to: number) => {model.changeControl('storage', arrayMove(model['storage'], from, to))};

  return (

      <div className={styles['container']}>
        <div className={styles['row']}>
          <div className={styles['direct']}>

            <div className={styles['direct-title']}>{'Сообщения'}</div>
            
            <DirectColumn direct={direct['response']} />
            
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
          
            <MessagesList messages={messages['response']}/>
                    
            <div className={styles['input']}>

              <input {...getInputProps()} />

              <MuiTextField
                value={model['content']}
                className={styles['textinput']}
                onChange={onChange}
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
                    direct['response'][0]['message'].changeControl('content', model['content'])
                    const message = {
                      id: Date.now().toString(),
                      content: model['content'],
                      date_send: new Date(),
                      sender: RootStore['session']['user'],
                      storage: [...model['storage']]
                    };
                    messages.changeControl('response', [...messages['response'], message])
                    model.changeControl('content', null);
                    model.changeControl('storage', []);
                    // Router.push({ pathname: router['pathname'], query: { ...router['query'] } });
                  }
                }}
              />

            </div>

            <div {...getRootProps({ className: `${styles['dropzone']} ${isDragActive ? styles['dropzone-active'] : ''}` })}>
              
              {model['storage']['length'] ? 
                <SortableList onSortEnd={onSortEnd} className={styles['dropzone-container']}>

                {model['storage'].map((file, i) =>  i < 5 ? 
                    
                  <SortableItem key={file['file_id']}>
                    <div className={styles['dropzone-thumb']} >
                      <img src={file['public_url']} className={Clsx(styles['dropzone-img'],'animated fadeIn')}/>
                    </div>
                  </SortableItem>

                : null)}

                </SortableList>
              : <span className={styles['dropzone-title']}>{'Перетащите сюда несколько файлов.'}</span>}

            </div>
          </div>
        </div>
      </div>
    
  );
}));