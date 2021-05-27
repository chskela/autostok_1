import { types } from 'mobx-state-tree';
import { request } from '@services/request';
import { applySnapshot } from 'mobx-state-tree';
import { actionsHooks, volatileHooks } from '@models/hooks';

export const CarsMarkModel = types.model({
  id: types.maybeNull(types.string),
  name: types.maybeNull(types.string),
  label: types.maybeNull(types.string),
}).volatile(self => ({
  ...volatileHooks(self),
})).actions(self =>({
  ...actionsHooks(self),
})).preProcessSnapshot((snapshot) => {
  return {...snapshot}
})

export const CarsModelModel = types.model({
  id: types.maybeNull(types.string),
  name: types.maybeNull(types.string),
  label: types.maybeNull(types.string),
}).volatile(self => ({
  ...volatileHooks(self),
})).actions(self =>({
  ...actionsHooks(self),
})).preProcessSnapshot((snapshot) => {
  return {...snapshot}
})

export const CarsGenerationModel = types.model({
  id: types.maybeNull(types.string),
  name: types.maybeNull(types.string),
  label: types.maybeNull(types.string),
}).volatile(self => ({
  ...volatileHooks(self),
})).actions(self =>({
  ...actionsHooks(self),
})).preProcessSnapshot((snapshot) => {
  return {...snapshot}
})

export const CarsModel = types.model({
  id: types.maybeNull(types.string),
  label: types.maybeNull(types.string),
  mark: types.maybeNull(types.late(()=>CarsMarkModel)),
  model: types.maybeNull(types.late(()=>CarsModelModel)),
  generation: types.maybeNull(types.late(()=>CarsGenerationModel)),
}).volatile(self => ({
  ...volatileHooks(self),
})).actions(self =>({
  ...actionsHooks(self),
  selectControl(value){
    const skip = ['year', 'type', 'drive'];
    const snapshot = value ? {...value} : {};
    skip.concat(['engine_size', 'transmission']);
    skip.forEach(item=>snapshot[item] = self[item]);
    setTimeout(() => applySnapshot(self, snapshot), 0);
  },
  setSubLabel(data){
    data.forEach((item)=>{
      let x = item['generation'];
      x['year_end'] = x['year_end'] ? x['year_end'] : new Date().getFullYear();
      x['year_begin'] = x['year_begin'] ? x['year_begin'] : new Date().getFullYear();
      item['sub_label'] = 'Выпускается с '+String(x['year_begin'])+' по '+String(x['year_end']);
    });
    return data
  },
  async setSuggests(value){
    if(value.length >= 3){
      const snapshot = { search: value };
      const response = await request('/cars/suggests', snapshot);
      if(response['status'] === 200){
        this.setSubLabel(response['data']);
        this.changeControl('suggests', response['data']);
      }
    }
  }
})).preProcessSnapshot((snapshot) => {
  return {...snapshot}
})