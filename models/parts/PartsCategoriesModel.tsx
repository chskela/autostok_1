import { types } from 'mobx-state-tree';
import { request } from '@services/request';
import { actionsHooks, volatileHooks } from '@models/hooks';

export const PartsCategoriesModel = types.model({
  id: types.maybeNull(types.string),
  name: types.maybeNull(types.string),
  label: types.maybeNull(types.string),
  is_parent: types.maybeNull(types.boolean),
}).volatile(self => ({
  ...volatileHooks(self),
})).actions(self =>({
  ...actionsHooks(self),
  async setSuggests(value){
    if(value.length >= 1){
      const snapshot = { search: value };
      const response = await request('/parts/suggests', snapshot);
      if(response['status'] === 200){
        this.changeControl('suggests', response['data']);
      }
    }
  },
})).preProcessSnapshot((snapshot) => {
  return {...snapshot}
})