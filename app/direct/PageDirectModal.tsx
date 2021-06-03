import React from 'react';
import Router from 'next/router';
import styles from './class.module.css';
import stylesModal from '@styles/Modal.module.css';

import { useRouter } from 'next/router';
import { observer } from 'mobx-react-lite';

import { Clsx } from '@components/core';
import { MuiModal } from '@components/core';
import { ModalProps } from '@components/props';
import { CloseCircleIcon } from '@components/icons';
import { MuiTextField, MuiAutocomplete } from '@components/core';

import { getSnapshot, applySnapshot } from 'mobx-state-tree';
import { DirectList } from '@models/direct/DirectList';
import { ReceptionPartsModel } from '@models/storehouse/reception/parts/ReceptionPartsModel';
import { DirectMessagesList } from '@models/direct/DirectList';
import { DirectTypingModel } from '@models/direct/DirectModel';

export const PageDirectModal = observer((props: any) => {
  const router = useRouter();
  const { select, id } = router['query'];
  const thumbnails = React.useRef(null);
  const [ loading, setLoading ] = React.useState(false);
  React.useEffect(() => {applySnapshot(messages, { ...props['messages'] })}, [props]);
  const [messages] = React.useState(DirectMessagesList.create({ ...props['messages'] }));
  React.useEffect(() => {Router['events'].on('routeChangeStart', ()=>setLoading(true))}, []);
  React.useEffect(() => {setLoading(false); setTimeout(() => mouseMove(thumbnails, 'init'), 150)}, [id]);
  const storage = messages['response'].reduce((acc, message) => message.id === id ? { ...message } : acc, {})['storage'];
  
  const propsSlideshow: any = {
    onMouseMove: (event)=>mouseMove(thumbnails, event),
    onMouseLeave: (event)=>mouseMove(thumbnails, event),
  }

  const mouseMove = (thumbnails, event) => {
    const color = '#006FFF';
    if(event === 'init' && thumbnails['current']){
      const childs = thumbnails['current']['childNodes'];
      if(childs['length'] > 0){
        childs[0]['style']['opacity'] = 1;
        childs[0]['style']['backgroundColor'] = color;
      }
    }else if(event['type'] === 'mousemove'){
      const x = event['nativeEvent']['offsetX'];
      const width = event['target']['offsetWidth'];
      ////////////////////////////////////////////////////////////
      const target = event['target']
      const images = target['parentNode']['childNodes'];
      const index = Math.floor((x / width) * images['length']);
      ////////////////////////////////////////////////////////////
      images.forEach(image => image['style']['opacity'] = 0);
      try { images[index]['style']['opacity'] = 1 } catch (error) { };
      ////////////////////////////////////////////////////////////
      const childs = thumbnails['current']['childNodes'];
      childs.forEach(row => row['style']['backgroundColor'] = null);
      try { childs[index]['style']['backgroundColor'] = color } catch (error) { };
    } else if(event['type'] === 'mouseleave'){
      ////////////////////////////////////////////////////////////
      const target = event['target']
      const images = target['parentNode']['childNodes'];
      images.forEach(image => image['style']['opacity'] = 0);
      ////////////////////////////////////////////////////////////
      thumbnails['current']['childNodes'].forEach(row => {
        row['style']['backgroundColor'] = null
      });
      ////////////////////////////////////////////////////////////
      if(images['length'] > 0){
        images[0]['style']['opacity'] = 1;
        const childs = thumbnails['current']['childNodes'];
        try { childs[0]['style']['backgroundColor'] = color } catch (error) { };
      }
    }
  }
  
  
  return id ? (
    <MuiModal {...ModalProps(props)} open={!!id} onClose={() => !loading && router.back()}>
      <div className={stylesModal['header']}>
        <div className={stylesModal['close']} onClick={() => !loading && router.back()}><CloseCircleIcon /></div>
      </div>
      <div className={'flex flex-row w-[530px] h-[550px] p-4'}>
        <div className={Clsx(styles['slideshow'], 'w-[500px]')}>
          <div className={Clsx(styles['images'], 'w-[500px] h-[500px]')} {...propsSlideshow}>
            {storage.map((row, index) => (
              <img key={index} src={row['public_url']} />
            ))}
          </div>

          <div ref={thumbnails} className={Clsx(styles['thumbnails'], 'w-[500px]')}>
            {storage.map((row, index) => <div key={index} />)}
          </div>
        </div>
      </div>
    </MuiModal>
  ) : null
});