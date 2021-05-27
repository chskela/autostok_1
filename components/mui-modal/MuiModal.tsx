import React from 'react';
import styles from './MuiModal.useStyles.module.css';

import { Clsx } from '@components/core';
import { Slide, SlideProps } from '@material-ui/core';
import { Dialog, DialogProps } from '@material-ui/core';

interface IProps {
  open?: DialogProps['open'];
  onClose?: DialogProps['onClose'];
  children?: DialogProps['children'];
  className?: DialogProps['className'];
  direction?: SlideProps['direction'] | any;
  closeEsc?: DialogProps['disableEscapeKeyDown'];
  closeBackdrop?: DialogProps['disableBackdropClick'];
  transitionDuration?: DialogProps['transitionDuration'],
}

export const MuiModal = React.memo<IProps>((props) => {
  return (
    <Dialog
      maxWidth={false}
      open={props['open'] ? props['open'] : false}
      disableEscapeKeyDown={true ? !props['closeEsc'] : false}
      className={Clsx(styles['mui-modal'], props['className'])}
      disableBackdropClick={true ? !props['closeBackdrop'] : false}
      TransitionComponent={TransitionComponent} TransitionProps={TransitionProps(props)}
      onClose={(event, params)=>{props['onClose'] ? props.onClose(event, params) : null}}
      transitionDuration={props['transitionDuration'] ? props['transitionDuration'] : 500}
    >
      {props['children']}
    </Dialog>
  );
})

export const TransitionProps: any = (props) => {
  return {
    direction: props['direction'] ? props['direction'] : 'up'
  }
}

export const TransitionComponent: any = React.forwardRef((props: any, ref: any) => {
  return (
    <Slide ref={ref} {...props} direction={props['direction']}/>
  )
})