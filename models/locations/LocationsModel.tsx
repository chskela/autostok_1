import { types } from 'mobx-state-tree';
import { request } from '@services/request';
import { actionsHooks, volatileHooks } from '@models/hooks';

export const LocationsModel = types.model({
  id: types.maybeNull(types.string),
  fias: types.maybeNull(types.string),
  label: types.maybeNull(types.string),
  geo_lat: types.maybeNull(types.string),
  geo_lon: types.maybeNull(types.string),
  area_fias: types.maybeNull(types.string),
  flat_fias: types.maybeNull(types.string),
  city_fias: types.maybeNull(types.string),
  house_fias: types.maybeNull(types.string),
  fias_level: types.maybeNull(types.string),
  region_fias: types.maybeNull(types.string),
  street_fias: types.maybeNull(types.string),
  settlement_fias: types.maybeNull(types.string),
}).volatile(self => ({
...volatileHooks(self),
})).actions(self =>({
  ...actionsHooks(self),
  changeControl(contol, value){
    self[contol] = value;
  },
  ////////////////////
  async setSuggests({value: value=null, from_bound: from_bound=null, to_bound: to_bound=null}){
    if(value.length >= 3){
      const snapshot = { search: value, to_bound, from_bound };
      const response = await request('/suggests/locations', snapshot, null);
      if(response['status'] === 200){
        this.changeControl('suggests', response['data']);
      }
    }
  },
})).preProcessSnapshot((snapshot) => {
  return {...snapshot}
})