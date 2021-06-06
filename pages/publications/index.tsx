import React from 'react';
import { getQuery } from '@services/routing';
import { AuthControl } from '@services/routing';

import { observer } from 'mobx-react-lite';
import { getSnapshot, applySnapshot } from 'mobx-state-tree';
import { PublicationsPartsList } from '@models/publications/parts/PublicationsPartsList';

import { types } from 'mobx-state-tree';
import { MainLayouts } from '@layouts/MainLayouts';
import { ListPublications } from '@app/publications/ListPublications';

const index = observer((props) => (
  <MainLayouts {...props}>
    <ListPublications {...props}/>
  </MainLayouts>
))

export const RouteCarModel = types.model({
  mark: types.maybeNull(types.string),
  model: types.maybeNull(types.string),
  generation: types.maybeNull(types.string),
}).actions(self =>({
  changeControl(contol, value){
    self[contol] = value;
  },
})).preProcessSnapshot((snapshot) => {
  return {...snapshot};
});

export const RoutePartsModel = types.model({
  mark: types.maybeNull(types.string),
  model: types.maybeNull(types.string),
  category: types.maybeNull(types.string),
  generation: types.maybeNull(types.string),
}).actions(self =>({
  changeControl(contol, value){
    self[contol] = value;
  },
})).preProcessSnapshot((snapshot) => {
  return {...snapshot};
});

export const RouteLocationModel = types.model({
  fias: types.maybeNull(types.string),
}).actions(self =>({
  changeControl(contol, value){
    self[contol] = value;
  },
})).preProcessSnapshot((snapshot) => {
  return {...snapshot};
});
  
export const RouteModel = types.model({
  location: types.maybeNull(types.late(()=>RouteLocationModel)),
  parts: types.maybeNull(types.array(types.late(()=>RoutePartsModel))),
}).actions(self =>({
  changeControl(contol, value){
    self[contol] = value;
  },
})).preProcessSnapshot((snapshot) => {
  return {...snapshot};
});

export const getServerSideProps = async (context) => {
  ////////////////////////////////////////////////////
  await AuthControl(context);
  const query = getQuery(context);
  const model = PublicationsPartsList.create();
  ////////////////////////////////////////////////////
  !query['location'] ? query['location'] = {} : null;
  !query['location']['fias_level'] ? query['location']['fias_level'] = '4' : null;
  ////////////////////////////////////////////////////
  applySnapshot(model['filter'], query);
  await model.initialModel({context: context});
  return {props: {model: {...getSnapshot(model)}}};
}

export default index;