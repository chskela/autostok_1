import { types } from 'mobx-state-tree';
import { request } from '@services/request';
import { getSnapshot, applySnapshot } from 'mobx-state-tree';

import { CarsModel } from '@models/cars/CarsModel';
import { PartsCategoriesModel } from '@models/parts/PartsCategoriesModel';

import { PaginatorModel } from '@models/paginator/PaginatorModel';
import { ReceptionPartsModel } from '@models/storehouse/reception/parts/ReceptionPartsModel';

export const setModelRow = (node) => {
  node.forEach((item, index) => {
    node[index] = ReceptionPartsModel.create(item);
  });
};

export const ReceptionPartsListFilter = types.model({
  car: types.maybeNull(types.late(()=>CarsModel)),
  part_category: types.maybeNull(types.late(()=>PartsCategoriesModel)),
}).actions(self =>({
  changeControl(contol, value){
    self[contol] = value;
  },
})).preProcessSnapshot((snapshot) => {
  return {...snapshot}
})

export const ReceptionPartsList = types.model({
  response: types.optional(types.frozen(), []),
  isFetching: types.optional(types.boolean, false),
  paginator: types.maybeNull(types.late(()=>PaginatorModel)),
  filter: types.maybeNull(types.late(()=>ReceptionPartsListFilter)),
}).actions(self =>({
  changeControl(contol, value){
    self[contol] = value;
  },
  initialModel({context}){
    return new Promise(async(resolve) => {
      this.changeControl('isFetching', true);
      const snapshot = {...getSnapshot(self)};
      delete snapshot['response']; delete snapshot['isFetching'];
      const response = await request('/reception/parts/list', snapshot, context);
      //////////////////////////
      if(response['status'] === 200){
        applySnapshot(self, response['data']);
        this.changeControl('isFetching', false);
      }
      setTimeout(() => resolve(response), 0);
      //////////////////////////
    })
  },
})).preProcessSnapshot((snapshot) => {
  if(snapshot['response']){
    const response = [...snapshot['response']];
    setModelRow(response); snapshot['response'] = response;
  }
  return {...snapshot}
})