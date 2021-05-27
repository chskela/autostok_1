import { types } from 'mobx-state-tree';
import { request } from '@services/request';
import { getSnapshot, applySnapshot } from 'mobx-state-tree';

import { PaginatorModel } from '@models/paginator/PaginatorModel';
import { RealisationPartsModel } from '@models/storehouse/realisation/parts/RealisationPartsModel';

export const setModelRow = (node) => {
  node.forEach((item, index) => {
    node[index] = RealisationPartsModel.create(item);
  });
};

export const RealisationPartsList = types.model({
  response: types.optional(types.frozen(), []),
  isFetching: types.optional(types.boolean, false),
  paginator: types.maybeNull(types.late(()=>PaginatorModel)),
}).actions(self =>({
  changeControl(contol, value){
    self[contol] = value;
  },
  initialModel({context}){
    return new Promise(async(resolve) => {
      this.changeControl('isFetching', true);
      const snapshot = {...getSnapshot(self)};
      delete snapshot['response']; delete snapshot['isFetching'];
      const response = await request('/realisation/parts/list', snapshot, context);
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