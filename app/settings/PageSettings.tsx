import React from 'react';
import styles from './class.module.css';

import { observer } from 'mobx-react-lite';
import { RootStore } from '@store/RootStore';

import AvatarEditor from 'react-avatar-editor';
import { applySnapshot } from 'mobx-state-tree';

import { useDropzone } from 'react-dropzone';
import { MuiTabs, MuiTab } from '@components/core';
import { MuiTextField, MuiButton } from '@components/core';
import { MuiAutocomplete, MuiSlider } from '@components/core';

import { ZoomInIcon, ZoomOutIcon, PaperclipIcon } from '@components/icons';

export const PageSettings = observer((props) => {
  const refAvatar = React.useRef(null);
  const onChangeTab = (value) => {};
  const model = RootStore['session']['user'];
  const [scale, setScale] = React.useState(1);
  React.useEffect(() => { applySnapshot(model, {...props['model']}) }, [props]);
  const onDrop = React.useCallback(files => { files['length'] > 0 && setImage(files[0]) }, []);
  const [image, setImage] = React.useState(model.getPreview() ? model.getPreview() : '/icons/brake.svg');

  const { open, getRootProps, getInputProps, inputRef, isDragActive } = useDropzone({
    onDrop: onDrop, noClick: true, accept: ['image/png', 'image/jpg', 'image/jpeg']
  })

  const setAvatar = () => {
    model.changeControl('isFetching',true);
    return new Promise(async(resolve) => {
      const file: any = image;
      if(file instanceof File) {
        const fileName = 'avatar.png'
        const response = await fetch(refAvatar['current'].getImage().toDataURL());
        await model.addAvatars([new File([await response.blob()], fileName, {type: 'image/png'})]);
      }
      setTimeout(() => resolve(true), 0);
    })
  }

  return (
    <div className={'flex flex-col flex-1'}>

      <div className={'flex flex-row w-[calc(100%-350px)] mb-3'}>
        <MuiTabs value={1} className={styles['tabs']} onChange={(event, value)=>onChangeTab(value)}>
          <MuiTab value={1} label={<div data-role={'label'}>{'Мой профиль'}</div>}/>
        </MuiTabs>
      </div>

      <div className={'flex flex-row flex-1 p-4'}>
        <div className={'flex flex-col w-[700px] h-[100%]'}>
          <MuiTextField
            label={'Имя'}
            value={model['first_name']}
            onChange={(value)=>model.changeControl('first_name', value)}
          />

          <MuiTextField
            label={'Фамилия'}
            value={model['last_name']}
            onChange={(value)=>model.changeControl('last_name', value)}
          />

          <MuiTextField
            label={'Отчество'}
            value={model['middle_name']}
            onChange={(value)=>model.changeControl('middle_name', value)}
          />

          <MuiTextField
            type={'mask'}
            label={'Телефон'}
            typemask={'phone'}
            value={model['phone']}
            onChange={(value)=>model.changeControl('phone', value)}
          />

          <MuiButton
            label={'Сохранить'}
            loading={model['isFetching']}
            className={'mt-[10px] ml-[auto]'}
            onClick={async()=>{
              await setAvatar();
              model.createModel();
            }}
          />
        </div>

        <div className={'flex flex-col w-[100%] h-[100%]'}>
          <MuiButton
            onClick={open}
            label={'Выбрать'}
            icon={<PaperclipIcon/>}
            className={'mt-[10px] ml-[auto]'}
          />

          <div className={styles['avatar']}>
            <input {...getInputProps()}/>
            <AvatarEditor
              border={0}
              scale={scale}
              borderRadius={9999}
              width={200} height={200}
              color={[255,255,255,0.5]}
              image={image} ref={refAvatar}
            />

            <div className={styles['slider-block']}>
              <ZoomInIcon onClick={()=>setScale(scale+(0.1))}/>
              
              <MuiSlider
                value={scale}
                orientation={'vertical'}
                min={1} max={2} step={0.01}
                className={styles['slider']}
                onChange={(event, value)=>setScale(value)}
              />

              <ZoomOutIcon onClick={()=>setScale(scale-(0.1))}/>
            </div>
          </div>

          <MuiTextField
            value={model['nickname']}
            placeholder={'ООО "AUTOSTOK"'}
            label={'Представление в сети'}
            onChange={(value)=>model.changeControl('nickname', value)}
          />

          <MuiAutocomplete
            label={'Город'}
            optionLabel={'label'}
            value={model['location']}
            options={model['location']['suggests']}
            component={model['location']['component']}
            onChange={(value)=>model['location'].selectControl(value)}
            onInputChange={(value)=>model['location'].setSuggests({value: value, from_bound: 'city', to_bound: 'city'})}
          />
        </div>
      </div>
    </div>
  )
})