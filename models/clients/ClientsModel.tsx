import { types } from 'mobx-state-tree';
import { request } from '@services/request';
import { actionsHooks, volatileHooks } from '@models/hooks';
import { getSnapshot, applySnapshot } from 'mobx-state-tree';

export const ClientsModel = types.model({
  id: types.maybeNull(types.string),
  phone: types.maybeNull(types.string),
  label: types.maybeNull(types.string),
  last_name: types.maybeNull(types.string),
  first_name: types.maybeNull(types.string),
  middle_name: types.maybeNull(types.string),
}).volatile(self => ({
...volatileHooks(self),
})).actions(self =>({
  ...actionsHooks(self),
  changeControl(contol, value){
    self[contol] = value;
  },
  ////////////////////
  async setSuggests(value){
    if(value.length >= 3){
      const snapshot = { search: value };
      const response = await request('/clients/suggests', snapshot, null);
      if(response['status'] === 200){
        this.changeControl('suggests', response['data']);
      }
    }
  },
})).preProcessSnapshot((snapshot) => {
  return {...snapshot}
})