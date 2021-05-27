import { types } from 'mobx-state-tree';

import { ReceptionPartsModel } from '@models/storehouse/reception/parts/ReceptionPartsModel';
import { RealisationPartsModel } from '@models/storehouse/realisation/parts/RealisationPartsModel';

export const BalancePartsModel = types.model({
  count: types.maybeNull(types.number),
  profit: types.maybeNull(types.number),
  reception_parts: types.maybeNull(types.late(()=>ReceptionPartsModel)),
  realisation_parts: types.maybeNull(types.late(()=>RealisationPartsModel)),
}).actions(self =>({
  changeControl(contol, value){
    self[contol] = value;
  },
})).views(self => ({
  getCount(){
    return String(self['count'] || 0);
  },
})).preProcessSnapshot((snapshot) => {
  return {...snapshot}
})