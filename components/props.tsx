import { Clsx } from '@components/core';
import stylesModal from '@styles/Modal.module.css';

export const ModalProps: any = (props) => {
  return {
    closeEsc: true,
    direction: 'up',
    closeBackdrop: true,
    className: Clsx(stylesModal['modal'], props['className'])
  }
}

// export const ModalDocProps: any = (props) => {
//   // const stylesModal = ModalUseStyles(props);

//   return {
//     closeEsc: true,
//     direction: 'left',
//     closeBackdrop: true,
//     // className: Clsx(stylesModal.modalDoc, props['className'])
//   }
// }