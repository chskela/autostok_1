import { types } from 'mobx-state-tree';
import { request } from '@services/request';
import { getSnapshot, applySnapshot } from 'mobx-state-tree';

import { DirectModel } from '@models/direct/DirectModel';
import { DirectMessagesModel } from '@models/direct/DirectModel';
import { PaginatorModel } from '@models/paginator/PaginatorModel';

export const setModelDirect = (node) => {
  node.forEach((item, index) => {
    node[index] = DirectModel.create(item);
  });
};

export const setModelMessage = (node) => {
  node.forEach((item, index) => {
    node[index] = DirectMessagesModel.create(item);
  });
};

export const DirectList = types.model({
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
      const response = await request('/direct/list', snapshot, context);
      //////////////////////////
      if(response['status'] === 200){
        const data = {...response['data']};
        const array = data['response'] ? data['response'] : [];
        response['data']['response'] = self['response'].concat(array);
        applySnapshot(self, response['data']); this.changeControl('isFetching', false);
      }
      setTimeout(() => resolve(response), 0);
      //////////////////////////
    })
  },
  loadMoreModel({context: context=null}){
    const page = self['paginator']['page'];
    self['paginator'].changeControl('page', page+1);
    setTimeout(() => this.initialModel({context: context}), 0);
  },
})).preProcessSnapshot((snapshot) => {
  if(Array.isArray(snapshot['response'])){
    const response = [...snapshot['response']];
    setModelDirect(response); snapshot['response'] = response;
  }
  return {...snapshot}
})


export const DirectMessagesList = types.model({
  response: types.optional(types.frozen(), []),
  isFetching: types.optional(types.boolean, false),
  paginator: types.maybeNull(types.late(()=>PaginatorModel)),
}).actions(self =>({
  changeControl(contol, value){
    self[contol] = value;
  },
  initialModel({context, direct}){
    return new Promise(async(resolve) => {
      this.changeControl('isFetching', true);
      const param = {'direct': {'id': direct}};
      const snapshot = {...getSnapshot(self), ...param};
      delete snapshot['response']; delete snapshot['isFetching'];
      const response = await request('/direct/messages', snapshot, context);
      //////////////////////////
      if(response['status'] === 200){
        const data = {...response['data']};
        const array = data['response'] ? data['response'] : [];
        response['data']['response'] = self['response'].concat(array);
        applySnapshot(self, response['data']); this.changeControl('isFetching', false);
      }
      setTimeout(() => resolve(response), 0);
      //////////////////////////
    })
  },
  loadMoreModel({context: context=null}){
    const page = self['paginator']['page'];
    self['paginator'].changeControl('page', page+1);
    setTimeout(() => this.initialModel({context: context}), 0);
  },
})).preProcessSnapshot((snapshot) => {
  if(Array.isArray(snapshot['response'])){
    const response = [...snapshot['response']];
    setModelMessage(response); snapshot['response'] = response;
  }
  return {...snapshot}
})