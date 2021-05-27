import { types } from 'mobx-state-tree';
import { request } from '@services/request';
import { getSnapshot } from 'mobx-state-tree';
import { setNookie } from 'next-nookies-persist';

import { UsersModel } from '@models/users/UsersModel';

export const RegistrationModel = types.model({
  user: types.maybeNull(types.late(()=>UsersModel)),
  auth: types.maybeNull(types.late(()=>LoginModel)),
}).volatile(self => ({
  isFetching: false,
})).actions(self =>({
  changeControl(contol, value){
    self[contol] = value;
  },
})).preProcessSnapshot((snapshot) => {
  return {...snapshot}
})

export const LoginModel = types.model({
  login: types.maybeNull(types.string),
  password: types.maybeNull(types.string),
}).volatile(self => ({
  isFetching: false,
})).actions(self =>({
  changeControl(contol, value){
    self[contol] = value;
  },
  controlLogin({context: context=undefined}){
    return new Promise(async(resolve) => {
      this.changeControl('isFetching', true);
      const snapshot = {...getSnapshot(self)};
      const response = await request('/login', snapshot, context);
      this.changeControl('isFetching', false); const param = Array(3).fill(undefined);
      response['data']['certificate'] && setNookie('certificate', response['data']['certificate'], ...param, context);
      setTimeout(() => resolve(response), 0);
    })
  }
})).preProcessSnapshot((snapshot) => {
  return {...snapshot}
})