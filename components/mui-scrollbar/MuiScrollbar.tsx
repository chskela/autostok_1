import React from 'react';
import styles from './MuiScrollbar.useStyles.module.css';

import { Clsx } from '@components/core'
import { Scrollbar, ScrollbarProps } from 'react-scrollbars-custom';

interface IProps {
  ref?: any;
  style?: any;
  children?: ScrollbarProps['children'];
  className?: ScrollbarProps['className'];
}

export const MuiScrollbar = React.memo<IProps>(React.forwardRef((props, refForward) => {
  const ref: any = refForward;
  
  const wrapperProps = { 
    renderer: (props) => {
      const { elementRef, ...other } = props;
      const { position, right, ...otherStyle } = props['style'];
      return <div {...other} ref={elementRef} className={styles['wrapper']} style={otherStyle} data-role={'wrapper'}/>;
    }
  }

  const scrollerProps = { 
    renderer: (props) => {
      const { elementRef, ...other } = props;
      const { position, ...otherStyle } = props['style'];
      return <div {...other} ref={elementRef} className={styles['scroller']} style={otherStyle} data-role={'scroller'}/>;
    }
  }

  const contentProps = {
    renderer: (props) => {
      const { elementRef, ...other } = props;
      const { minHeight, minWidth, padding, ...otherStyle } = props['style'];
      return <div {...other} ref={elementRef} className={styles['content']} style={otherStyle} data-role={'content'}/>;
    }
  }

  const trackXProps = {
    renderer: (props) => {
      const { elementRef, ...other } = props;
      const { top, right, width, height, borderRadius, background, ...otherStyle } = props['style'];
      return <div {...other} ref={elementRef} className={styles['track-x']} style={otherStyle} data-role={'track-x'}/>;
    }
  }

  const trackYProps = {
    renderer: (props) => {
      const { elementRef, ...other } = props;
      const { top, right, width, height, borderRadius, background, ...otherStyle } = props['style'];      
      return <div {...other} ref={elementRef} className={styles['track-y']} style={otherStyle} data-role={'track-y'}/>;
    }
  }

  return (
    <div className={Clsx(styles['mui-scrollbar-container'], props['className'])} style={props['style']}>
      <Scrollbar
        ref={ref} createContext={true}
        className={styles['mui-scrollbar']}
        trackYProps={trackYProps} trackXProps={trackXProps}
        wrapperProps={wrapperProps} scrollerProps={scrollerProps} contentProps={contentProps}
      >
        {props['children']}
      </Scrollbar>
    </div>
  )
}))