import React from 'react';
import styles from './MuiSlider.useStyles.module.css';

import { Clsx } from '@components/core';
import { Slider, SliderProps } from '@material-ui/core';

interface MuiSliderProps extends SliderProps{onChange?: any};
export const MuiSlider = React.memo<MuiSliderProps>((props) => {
  return (
    <Slider {...props} className={Clsx(styles['mui-slider'], props['className'])}/>
  )
})