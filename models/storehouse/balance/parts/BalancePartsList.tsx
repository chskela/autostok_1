import { types } from 'mobx-state-tree';
import { request } from '@services/request';
import { getSnapshot, applySnapshot } from 'mobx-state-tree';

import { PaginatorModel } from '@models/paginator/PaginatorModel';
import { BalancePartsModel } from '@models/storehouse/balance/parts/BalancePartsModel';

export const setModelRow = (node) => {
  node.forEach((item, index) => {
    node[index] = BalancePartsModel.create(item);
  });
};

export const BalancePartsList = types.model({
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
      const response = await request('/balance/parts/list', snapshot, context);
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