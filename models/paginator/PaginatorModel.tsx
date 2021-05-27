import { types } from 'mobx-state-tree';

export const PaginatorModel = types.model({
  page: types.maybeNull(types.integer),
  page_size: types.maybeNull(types.integer),
  page_total: types.maybeNull(types.integer),
  count_total: types.maybeNull(types.integer)
}).actions(self =>({
  changeControl(contol, value){
    self[contol] = value;
  }
})).views(self => ({
  isLast(){
    return Boolean(
      (self['page_total'] ? self['page'] : self['page'] - 1) === self['page_total']
    );
  }
})).preProcessSnapshot((snapshot) => {
  return {...snapshot}
})