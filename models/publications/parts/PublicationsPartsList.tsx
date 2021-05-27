import { types } from 'mobx-state-tree';
import { request } from '@services/request';
import { getSnapshot, applySnapshot } from 'mobx-state-tree';

import { pick } from 'lodash';
import { stringify } from 'qs';

import { clone } from 'mobx-state-tree';
import { CarsModel } from '@models/cars/CarsModel';
import { PartsCategoriesModel } from '@models/parts/PartsCategoriesModel';

import { PaginatorModel } from '@models/paginator/PaginatorModel';
import { LocationsModel } from '@models/locations/LocationsModel';
import { ReceptionPartsModel } from '@models/storehouse/reception/parts/ReceptionPartsModel';

export const setModelRow = (node) => {
  node.forEach((item, index) => {
    if(!Array.isArray(item)){
      node[index] = ReceptionPartsModel.create(item);
    } else if (Array.isArray(item)){
      item.forEach((item2, index2) => {
        item[index2] = ReceptionPartsModel.create(item2);
      })
    }
  });
};

export const getResponse = (response = []) => {
  let i = 0;
  let array = [];
  while (i < response['length']) {
    array.push(response.slice(i, i+2)); i = i+2;
  }
  return array;
}

export const PublicationsPartsListFilter = types.model({
  location: types.maybeNull(types.late(()=>LocationsModel)),
  parts: types.optional(types.array(types.late(()=>PartsFilter)), []),
}).actions(self =>({
  changeControl(contol, value){
    self[contol] = value;
  },
  ////////////////////
  addParts(model){
    if(model['car']['mark']['id'] && model['car']['model']['id']){
      if(model['part_category']['id'] && model['car']['generation']['id']){
        self['parts'].push(clone(model));
      }
    }
  },
  deleteParts(model_prev){
    self['parts'].splice(self['parts'].indexOf(model_prev), 1)
  },
  ////////////////////
  getFilterURL(){
    let keys = [];    
    const snapshot = getSnapshot(self);

    keys.push('location.fias');
    keys.push('location_type');
    snapshot['parts'].forEach((item, index) => {
      keys.push('parts['+String(index)+'].car.mark.id');
      keys.push('parts['+String(index)+'].car.model.id');
      keys.push('parts['+String(index)+'].part_category.id');
      keys.push('parts['+String(index)+'].car.generation.id');
    });

    const data = pick(snapshot, keys);
    return stringify(data, { encode: false });
  }
})).preProcessSnapshot((snapshot) => {
  return {...snapshot}
})

export const PartsFilter = types.model({
  car: types.maybeNull(types.late(()=>CarsModel)),
  part_category: types.maybeNull(types.late(()=>PartsCategoriesModel)),
}).preProcessSnapshot((snapshot) => {
  return {...snapshot}
})

export const PublicationsPartsList = types.model({
  response: types.optional(types.frozen(), []),
  isFetching: types.optional(types.boolean, false),
  paginator: types.maybeNull(types.late(()=>PaginatorModel)),
  filter: types.maybeNull(types.late(()=>PublicationsPartsListFilter)),
}).actions(self =>({
  changeControl(contol, value){
    self[contol] = value;
  },
  initialModel({context}){
    return new Promise(async(resolve) => {
      this.changeControl('isFetching', true);
      const snapshot = {...getSnapshot(self)};
      delete snapshot['response']; delete snapshot['isFetching'];
      const response = await request('/publications/parts/list', snapshot, context);
      //////////////////////////
      if(response['status'] === 200){
        const data = {...response['data']};
        const array = getResponse(data['response']);
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
    setModelRow(response); snapshot['response'] = response;
  }
  return {...snapshot}
})