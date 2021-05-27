import { types } from 'mobx-state-tree';
import { request } from '@services/request';
import { convertIntSeparator } from '@services/general';
import { getSnapshot, applySnapshot } from 'mobx-state-tree';

import { CarsModel } from '@models/cars/CarsModel';
import { StorageModel } from '@models/storage/StorageModel';
import { PartsCategoriesModel } from '@models/parts/PartsCategoriesModel';

export const ReceptionPartsModel = types.model({
  id: types.maybeNull(types.string),
  date: types.maybeNull(types.Date),
  label: types.maybeNull(types.string),
  price: types.maybeNull(types.number),
  count: types.maybeNull(types.integer),
  comment: types.maybeNull(types.string),
  serial_number: types.maybeNull(types.string),
  car: types.maybeNull(types.late(()=>CarsModel)),
  part_category: types.maybeNull(types.late(()=>PartsCategoriesModel)),
  images: types.optional(types.array(types.late(()=>StorageModel)), []),
}).volatile(self => ({
  isFetching: false,
})).actions(self => ({
  changeControl(contol, value){
    self[contol] = value;
  },
  ////////////////////
  getModel(){
    return new Promise(async(resolve) => {
      const snapshot = {...getSnapshot(self)};
      const response = await request('/reception/parts/id', snapshot, null);
      response['status'] === 200 && applySnapshot(self, response['data']); resolve(response);
    })
  },
  ////////////////////
  createModel(){
    return new Promise(async(resolve) => {
      this.changeControl('isFetching', true);
      const snapshot = {...getSnapshot(self)};
      const response = await request('/reception/parts/update', snapshot);
      //////////////////////////
      if(response['status'] === 200){
        applySnapshot(self, response['data']);
      }
      this.changeControl('isFetching', false);
      setTimeout(() => resolve(response), 0);
      //////////////////////////
    })
  },
  ////////////////////
  addImages(files){
    return new Promise(async(resolve) => {
      for (const file of files) {
        const model = StorageModel.create({filename: file['name']});
        self['images'].push(model); await model.uploadModel('/storage/upload', file); 
      }
      setTimeout(() => resolve(true), 0);
    })
  },
  deleteImages(model_prev){
    self['images'].splice(self['images'].indexOf(model_prev), 1);
  },
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
  getPreview(){
    const snapshot = {...getSnapshot(self)};
    return snapshot['images']['length'] > 0 ? snapshot['images'][0]['public_url'] : null;
  }
})).preProcessSnapshot((snapshot) => {
  try { !snapshot['images'] ? snapshot['images'] = [] : null } catch (e) {};
  return {...snapshot}
})