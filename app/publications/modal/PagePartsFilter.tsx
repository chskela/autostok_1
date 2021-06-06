import React from 'react';
import stylesModal from '@styles/Modal.module.css';

import { observer } from 'mobx-react-lite';

import { MuiModal } from '@components/core';
import { ModalProps } from '@components/props';
import { CloseCircleIcon } from '@components/icons';
import { MuiButton, MuiAutocomplete } from '@components/core';

import { PartsFilter } from '@models/publications/parts/PublicationsPartsList';

export const PagePartsFilter = observer((props: any) => {
  const { open, onClose, filter } = props;
  const [ model ] = React.useState(PartsFilter.create());

  return (
    <MuiModal {...ModalProps(props)} open={open} onClose={onClose}>
      <div className={stylesModal['header']}>
        <div className={stylesModal['label']}>{'Фильтр'}</div>
        <div className={stylesModal['close']} onClick={onClose}><CloseCircleIcon/></div>
      </div>

      <div className={'flex flex-col w-[600px] h-[auto] p-4'}>
        <MuiAutocomplete
          optionLabel={'label'}
          value={model['car']}
          optionSubLabel={'sub_label'}
          label={'Транспортное средство'}
          options={model['car']['suggests']}
          component={model['car']['component']}
          onChange={(value)=>model['car'].selectControl(value)}
          onInputChange={(value)=>model['car'].setSuggests(value)}
        />

        <MuiAutocomplete
          label={'Запчасть'}
          optionLabel={'label'}
          value={model['part_category']}
          options={model['part_category']['suggests']}
          component={model['part_category']['component']}
          onChange={(value)=>model['part_category'].selectControl(value)}
          onInputChange={(value)=>model['part_category'].setSuggests(value)}
        />

        <MuiButton
          label={'Добавить'}
          className={'ml-[auto] mt-[10px]'}
          onClick={()=>(filter.addParts(model), onClose())}
        />
      </div>
    </MuiModal>
  )
});