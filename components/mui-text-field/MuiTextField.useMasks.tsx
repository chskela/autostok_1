export const useMasks = (props) => {
  switch(props['typemask']){
    case 'phone':
      return ['8', ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/]
    default:
      return [];
  }
}