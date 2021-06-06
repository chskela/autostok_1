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
import { ReceptionPartsModel } from '@models/storehouse/reception/parts/ReceptionPartsModel';

export const PagePublications = observer((props: any) => {
  const router = useRouter();
  const id = router['query']['id'];
  const thumbnails = React.useRef(null);
  const [ loading, setLoading ] = React.useState(false);
  const [ model ] = React.useState(ReceptionPartsModel.create());

  const propsSlideshow: any = {
    onMouseMove: (event)=>mouseMove(thumbnails, event),
    onMouseLeave: (event)=>mouseMove(thumbnails, event),
  }

  React.useEffect(() => {
    const create = ReceptionPartsModel.create();
    applySnapshot(model, {...getSnapshot(create)});
  }, [id]);

  React.useEffect(() => {
    if(id && id !== 'create'){
      setLoading(false);
      model.changeControl('id', id);
      setTimeout(() => model.getModel(), 0);
      setTimeout(() => mouseMove(thumbnails, 'init'), 150);
    }
  }, [id]);


  React.useEffect(() => {
    Router['events'].on('routeChangeStart', ()=>setLoading(true));
  }, []);

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

  return (
    <MuiModal {...ModalProps(props)} open={!!id} onClose={()=>!loading && router.back()}>
      <div className={stylesModal['header']}>
        <div className={Clsx(stylesModal['label'], '!text-[19px]')}>{model['part_category']['label']}</div>
        <div className={stylesModal['close']} onClick={()=>!loading && router.back()}><CloseCircleIcon/></div>
      </div>

      <div className={'flex flex-row w-[1000px] h-[550px] p-4'}>
        <div className={Clsx(styles['slideshow'], 'w-[500px]')}>
          <div className={Clsx(styles['images'], 'w-[500px] h-[500px]')} {...propsSlideshow}>
            {model['images'].map((row, index) => (
              <img key={index} src={row['public_url']}/>
            ))}
          </div>

          <div ref={thumbnails} className={Clsx(styles['thumbnails'], 'w-[500px]')}>
            {model['images'].map((row, index) => <div key={index}/>)}
          </div>
        </div>

        <div className={'flex flex-col flex-1 px-4'}>
          <MuiAutocomplete
            readOnly={true}
            label={'Запчасть'}
            optionLabel={'label'}
            value={model['part_category']}
            className={styles['autocomplete']}
            options={model['part_category']['suggests']}
            component={model['part_category']['component']}
            onChange={(value)=>model['part_category'].selectControl(value)}
            onInputChange={(value)=>model['part_category'].setSuggests(value)}
          />

          <MuiAutocomplete
            readOnly={true}
            value={model['car']}
            optionLabel={'label'}
            optionSubLabel={'sub_label'}
            label={'Транспортное средство'}
            className={styles['autocomplete']}
            options={model['car']['suggests']}
            component={model['car']['component']}
            onChange={(value)=>model['car'].selectControl(value)}
            onInputChange={(value)=>model['car'].setSuggests(value)}
          />

          <MuiTextField
            readOnly={true}
            label={'Серийный номер'}
            value={model['serial_number']}
            className={styles['text-field']}
            onChange={(value)=>model.changeControl('serial_number', value)}
          />

          <MuiTextField
            rows={8}
            rowsMax={8}
            readOnly={true}
            multiline={true}
            label={'Комментарий'}
            value={model['comment']}
            className={styles['text-field']}
            onChange={(value)=>model.changeControl('comment', value)}
          />
        </div>
      </div>
    </MuiModal>
  )
});