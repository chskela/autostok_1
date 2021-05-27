import { types } from 'mobx-state-tree';
import { request } from '@services/request';
import { getSnapshot } from 'mobx-state-tree';

import { UsersModel } from '@models/users/UsersModel';
import { PaginatorModel } from '@models/paginator/PaginatorModel';

export const UsersList = types.model({
  search: types.maybeNull(types.string),
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
      const response = await request('/users/list', snapshot, context);
      //////////////////////////
      if(response['status'] === 200){
        this.changeControl('isFetching', false);
        this.setModelRow(response['data']['response']);
        this.changeControl('response', response['data']);
      }
      setTimeout(() => resolve(response), 0);
      //////////////////////////
    })
  },
  setModelRow(node){
    node.forEach((item, index) => {
      node[index] = UsersModel.create(item);
    });
  },
})).preProcessSnapshot((snapshot) => {
  return {...snapshot}
})