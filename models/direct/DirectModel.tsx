import { types } from 'mobx-state-tree';
import { request } from '@services/request';
import { getSnapshot } from 'mobx-state-tree';

import { UsersModel } from '@models/users/UsersModel';
import { StorageModel } from '@models/storage/StorageModel';
import { ReceptionPartsModel } from '@models/storehouse/reception/parts/ReceptionPartsModel';

export const DirectModel = types.model({
  id: types.maybeNull(types.string),
  name: types.maybeNull(types.string),
  message: types.maybeNull(types.late(()=>DirectMessagesModel)),
  reception_parts: types.maybeNull(types.late(()=>ReceptionPartsModel)),
  users: types.optional(types.array(types.late(()=>DirectUsersModel)), []),
}).actions(self => ({
  changeControl(contol, value){
    self[contol] = value;
  },
})).preProcessSnapshot((snapshot) => {
  return {...snapshot}
})


export const DirectUsersModel = types.model({
  id: types.maybeNull(types.string),
  user: types.maybeNull(types.late(()=>UsersModel)),
}).actions(self =>({
  changeControl(contol, value){
    self[contol] = value;
  },
})).preProcessSnapshot((snapshot) => {
  return {...snapshot}
})


export const DirectMessagesModel = types.model({
  id: types.maybeNull(types.string),
  content: types.maybeNull(types.string),
  date_send: types.maybeNull(types.Date),
  sender: types.maybeNull(types.late(()=>UsersModel)),
  storage: types.optional(types.array(types.late(()=>StorageModel)), []),
}).actions(self => ({
  changeControl(contol, value){
    self[contol] = value;
  },
})).preProcessSnapshot((snapshot) => {
  return {...snapshot}
})


export const DirectTypingModel = types.model({
  content: types.maybeNull(types.string),
  direct: types.maybeNull(types.late(()=>DirectModel)),
  storage: types.optional(types.array(types.late(()=>StorageModel)), []),
}).actions(self => ({
  changeControl(contol, value){
    self[contol] = value;
  },
  ////////////////////
  addStorage(files){
    return new Promise(async(resolve) => {
      for (const file of files) {
        const model = StorageModel.create({filename: file['name']});
        self['storage'].push(model); await model.uploadModel('/storage/upload', file); 
      }
      setTimeout(() => resolve(true), 0);
    })
  },
  ////////////////////
  createModel(){
    return new Promise(async(resolve) => {
      this.changeControl('isFetching', true);
      const snapshot = {...getSnapshot(self)};
      const response = await request('/direct/messages/create', snapshot);
      //////////////////////////
      if(response['status'] === 200){
        // applySnapshot(self, response['data']);
      }
      this.changeControl('isFetching', false);
      setTimeout(() => resolve(response), 0);
      //////////////////////////
    })
  },
  ////////////////////
})).preProcessSnapshot((snapshot) => {
  return {...snapshot}
})