import { types } from 'mobx-state-tree';
import { request } from '@services/request';
import { convertIntSeparator } from '@services/general';
import { getSnapshot, applySnapshot } from 'mobx-state-tree';

import { ClientsModel } from '@models/clients/ClientsModel';
import { ReceptionPartsModel } from '@models/storehouse/reception/parts/ReceptionPartsModel';

export const RealisationPartsModel = types.model({
  id: types.maybeNull(types.string),
  date: types.maybeNull(types.Date),
  label: types.maybeNull(types.string),
  price: types.maybeNull(types.number),
  count: types.maybeNull(types.integer),
  client: types.maybeNull(types.late(()=>ClientsModel)),
  reception_parts: types.maybeNull(types.late(()=>ReceptionPartsModel)),
}).actions(self =>({
  changeControl(contol, value){
    self[contol] = value;
  },
  ////////////////////
  getModel(){
    return new Promise(async(resolve) => {
      const snapshot = {...getSnapshot(self)};
      const response = await request('/realisation/parts/id', snapshot, null);
      response['status'] === 200 && applySnapshot(self, response['data']); resolve(response);
    })
  },
  ////////////////////
  createModel(){
    return new Promise(async(resolve) => {
      this.changeControl('isFetching', true);
      const snapshot = {...getSnapshot(self)};
      const response = await request('/realisation/parts/update', snapshot);
      //////////////////////////
      if(response['status'] === 200){
        applySnapshot(self, response['data']);
      }
      this.changeControl('isFetching', false);
      setTimeout(() => resolve(response), 0);
      //////////////////////////
    })
  }
  ////////////////////
})).views(self => ({
  getCount(){
    return String(self['count'] || 0);
  },
  getPrice(){
    return convertIntSeparator(self['price'])+' ₽';
  },
  getSum(){
    let result = 0;
    if(self['price'] && self['count']){
      result = self['price'] * self['count'];
    }
    return convertIntSeparator(result);
  },
})).preProcessSnapshot((snapshot) => {
  return {...snapshot}
})