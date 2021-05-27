import { types } from 'mobx-state-tree';
import { UsersModel } from '@models/users/UsersModel';

export const SessionStore = types.model({
  user: types.maybeNull(types.late(()=>UsersModel)),
}).preProcessSnapshot((snapshot) => {
  return {...snapshot}
})