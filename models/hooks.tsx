import { getRandonKey } from '@services/general';
import { applySnapshot, onSnapshot } from 'mobx-state-tree';

export const actionsHooks = (self) => {
  return {
    afterCreate(){
      self['component'] = getRandonKey();
      onSnapshot(self, snapshot => {
        this.changeControl('component', getRandonKey());
      })
    },
    changeControl(contol, value){
      self[contol] = value;
    },
    selectControl(value, skipFields=[]){
      const snapshot = value ? {...value} : {};
      skipFields.forEach(item=>snapshot[item] = self[item]);
      applySnapshot(self, snapshot);
    },
  }
}

export const volatileHooks  = (self) => {
  return {
    suggests: [],
    component: null,
  }
}