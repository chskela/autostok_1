import { types } from 'mobx-state-tree';
import { CalendarIcon, MessageIcon } from '@components/icons';
import { SettingsIcon, PullRequestIcon } from '@components/icons';

export const MenuLeft = [
  {
    link: '/publications',
    label: 'Объявления',
    icon: <CalendarIcon/>,
  },
  {
    link: '/storehouse',
    label: 'Мой склад',
    icon: <PullRequestIcon/>,
  },
  {
    link: '/direct',
    label: 'Сообщения',
    icon: <MessageIcon/>,
  },
  {
    link: '/settings',
    label: 'Настройки',
    icon: <SettingsIcon/>,
  },
];

export const MenuModel = types.model({
  link: types.maybeNull(types.string),
  label: types.maybeNull(types.string),
}).volatile(self => ({
  icon: null,
  select: false,
})).actions(self =>({
  changeControl(contol, value){
    self[contol] = value;
  },
})).preProcessSnapshot((snapshot) => {
  return {...snapshot}
})

export const MenuStore = types.model({
  left: types.optional(types.array(types.late(()=>MenuModel)), []),
}).actions(self =>({
  afterCreate(){
    MenuLeft.forEach(item => {
      const model = MenuModel.create(item);
      model.changeControl('icon', item['icon']); self['left'].push(model);
    });
  },
  setSelectRow({menu: menu, router: router}){
    menu.forEach(row => {
      /////////////////////////////////////////////////
      row.changeControl('select', false);
      if(row['link'] !== '/' ){
        if(router['pathname'].indexOf(row['link']) > -1){
          row.changeControl('select', true);
        }
      } else {
        if(router['pathname'] === row['link']){
          row.changeControl('select', true);
        }
      }
      /////////////////////////////////////////////////
      (row['children'] || []).forEach(subRow => {
        subRow.changeControl('select', false);
        if(router['pathname'] === subRow['link']){
          subRow.changeControl('select', true);
        }
      })
      /////////////////////////////////////////////////
    });
  }
})).preProcessSnapshot((snapshot) => {
  return {...snapshot}
})