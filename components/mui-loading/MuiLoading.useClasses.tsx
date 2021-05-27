import { makeStyles } from '@material-ui/styles';
import { fadeIn, fadeOut } from 'react-animations';

export const useClasses = makeStyles((theme) => ({
  '@keyframes fadeIn': fadeIn,
  enterActive: (props) => ({
    animationName: 'fadeIn',
    animationDuration: String(props['duration'])+'ms',
  }),

  '@keyframes fadeOut': fadeOut,
  exitActive: (props) => ({
    animationName: 'fadeOut',
    animationDuration: String(props['duration'])+'ms',
  }),
}), {index: 0})