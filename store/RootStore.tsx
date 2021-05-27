import { types } from 'mobx-state-tree';
import { MenuStore } from './menu/MenuStore';
import { SessionStore } from './session/SessionStore';

export const RootModel = types.model({
  isMobile: types.optional(types.boolean, false),
  menu: types.maybeNull(types.late(()=>MenuStore)),
  session: types.maybeNull(types.late(()=>SessionStore)),
}).actions(self =>({
  changeControl(contol, value){
    self[contol] = value;
  },
})).preProcessSnapshot((snapshot) => {
  return {...snapshot}
})

export const RootStore = RootModel.create();