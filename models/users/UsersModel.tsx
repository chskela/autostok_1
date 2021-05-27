import { types } from 'mobx-state-tree';
import { request } from '@services/request';
import { actionsHooks, volatileHooks } from '@models/hooks';
import { getSnapshot, applySnapshot } from 'mobx-state-tree';

import { StorageModel } from '@models/storage/StorageModel';
import { LocationsModel } from '@models/locations/LocationsModel';

export const UsersModel = types.model({
  id: types.maybeNull(types.string),
  phone: types.maybeNull(types.string),
  label: types.maybeNull(types.string),
  nickname: types.maybeNull(types.string),
  last_name: types.maybeNull(types.string),
  first_name: types.maybeNull(types.string),
  middle_name: types.maybeNull(types.string),
  location: types.maybeNull(types.late(()=>LocationsModel)),
  avatars: types.optional(types.array(types.late(()=>StorageModel)), []),
}).volatile(self => ({
  isFetching: false,
...volatileHooks(self),
})).actions(self =>({
  ...actionsHooks(self),
  ////////////////////
  async setSuggests(value){
    if(value.length >= 3){
      const snapshot = { search: value };
      const response = await request('/users/suggests', snapshot, null);
      if(response['status'] === 200){
        this.changeControl('suggests', response['data']);
      }
    }
  },
  ////////////////////
  getModel(){
    return new Promise(async(resolve) => {
      const snapshot = {...getSnapshot(self)};
      const response = await request('/users/id', snapshot, null);
      response['status'] === 200 && applySnapshot(self, response['data']); resolve(response);
    })
  },
  ////////////////////
  createModel(){
    console.log('0000')
    return new Promise(async(resolve) => {
      this.changeControl('isFetching', true);
      const snapshot = {...getSnapshot(self)};
      const response = await request('/users/update', snapshot, null);
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
  addAvatars(files){
    return new Promise(async(resolve) => {
      for (const file of files) {
        const model = StorageModel.create({filename: file['name']});
        self['avatars'].push(model); await model.uploadModel('/storage/upload', file); 
      }
      setTimeout(() => resolve(true), 0);
    })
  },
  deleteAvatars(model_prev){
    self['avatars'].splice(self['avatars'].indexOf(model_prev), 1);
  },
  ////////////////////
})).views(self => ({
  getUserLabel(){
    let result = '';
    let userModel = self;
    if(userModel['last_name']){
      result = userModel['last_name']
    }
    //////////////////////////
    if(userModel['first_name']){
      if(userModel['first_name'].charAt(0)){
        result = result+' '+userModel['first_name'].charAt(0)+'.'
      }
    }
    //////////////////////////
    if(userModel['middle_name']){
      if(userModel['middle_name'].charAt(0)){
        let separator = '';
        if(result.charAt(result.length-1) !== '.'){
          separator = ' '
        }
        result = result+separator+userModel['middle_name'].charAt(0)+'.'
      }
    }
    //////////////////////////
    return result;
  },
  getPreview(){
    const snapshot = {...getSnapshot(self)};
    return snapshot['avatars']['length'] > 0 ? snapshot['avatars'][0]['public_url'] : null;
  }
})).preProcessSnapshot((snapshot) => {
  return {...snapshot}
})