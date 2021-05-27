import React from 'react';
import { useMasks } from './MuiTextField.useMasks';
import styles from './MuiTextField.useStyles.module.css';

import { Clsx } from '@components/core'
import { TextField } from '@material-ui/core';
import { TextFieldProps } from '@material-ui/core';

import MaskedInput from 'react-text-mask';
import NumberFormat from 'react-number-format';

interface IProps {
  decimal?: number;
  typemask?: string;
  readOnly?: boolean;
  /////////////////////////////
  rows?: TextFieldProps['rows'];
  type?: TextFieldProps['type'];
  label?: TextFieldProps['label'];
  value?: TextFieldProps['value'];
  error?: TextFieldProps['error'];
  select?: TextFieldProps['select'];
  onFocus?: TextFieldProps['onFocus'];
  rowsMax?: TextFieldProps['rowsMax'];
  required?: TextFieldProps['required'];
  onChange?: TextFieldProps['onChange'];
  inputRef?: TextFieldProps['inputRef'];
  multiline?: TextFieldProps['multiline'];
  className?: TextFieldProps['className'];
  InputProps?: TextFieldProps['InputProps'];
  placeholder?: TextFieldProps['placeholder'];
  InputLabelProps?: TextFieldProps['InputLabelProps'];
  /////////////////////////////
}

export const MuiTextField = React.memo<IProps>((props) => {
  const onChange = (value) => {
    if(props['onChange']){
      props.onChange(value);
    }
  }

  const onFocus = (value) => {
    if(props['onFocus']){
      props.onFocus(value)
    }
  }

  const getInputProps = (props, inputProps) => {
    const { decimal, typemask, ...other } = props;
    return { decimal: decimal, typemask: typemask, ...inputProps };
  }

  const getInputComponent = (props) => {
    switch(props['type']){
      case 'mask':
        return renderMaskedInput;
      case 'number':
        return renderNumberFormat;
      default:
        return undefined;
    }
  }
  return (
    <TextField
      {...props}
      autoComplete={'off'}
      margin={'dense'} fullWidth={true}
      value={props['value'] ? props['value'] : ''}
      type={props['type'] ? props['type'] : 'search'}
      onChange={(event)=>onChange(event['target']['value'])}
      InputLabelProps={{...props['InputLabelProps'], shrink: true}}
      className={Clsx(styles['mui-text-field'], props['className'])}
      onBlur={(event)=>onFocus(false)} onFocus={(event)=>onFocus(true)}
      InputProps={{
        ...props['InputProps'],
        inputComponent: getInputComponent(props),
        readOnly: props['readOnly'], spellCheck: false,
        inputProps: getInputProps(props, props['inputProps']),
      }}
    />
  )
})

const renderMaskedInput = (props) => {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      guide={false}
      mask={useMasks(props)}
      ref={(ref)=>inputRef(ref ? ref['inputElement'] : null)}
    />
  );
}

const renderNumberFormat = (props) => {
  const thousandSeparator = ' ';
  const { decimal, inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      type={'text'}
      allowNegative={false}
      decimalScale={decimal}
      fixedDecimalScale={true}
      thousandSeparator={thousandSeparator}
      onValueChange={(value)=>onChange({target: {value: value['floatValue']}})}
      isAllowed={(values)=>(values['formattedValue'] === '' || values['floatValue'] <= 1000000000000)}
    />
  )
}