import React from 'react';
import styles from './MuiAutocomplete.useStyles.module.css';

import { Clsx } from '@components/core';
import { Paper } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { MuiSkeleton } from '@components/core';
import { TextFieldProps } from '@material-ui/core';
import { CloseIcon, DownIcon } from '@components/icons';
import { MuiTextField, MuiScrollbar } from '@components/core';
import { Autocomplete, AutocompleteProps } from '@material-ui/lab';

import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

interface IProps{
  readOnly?: boolean;
  component?: string;
  highlight?: boolean;
  optionLabel?: string;
  optionSubLabel?: string;
  disableClearable?: boolean;
  /////////////////////////////
  value?: any; options?: any;
  label?: TextFieldProps['label'];
  onFocus?: TextFieldProps['onFocus'];
  selectOnly?: TextFieldProps['select'];
  onChange?: TextFieldProps['onChange'];
  required?: TextFieldProps['required'];
  multiple?: TextFieldProps['multiline'];
  className?: TextFieldProps['className'];
  onInputChange?: TextFieldProps['onChange'];
  /////////////////////////////
}

export const MuiAutocomplete = React.memo<IProps>((props) => {
  const [open, setOpen] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');

  React.useEffect(() => {
    setInputValue('');
    const label = props['optionLabel'];    
    if(props['value'] && props['value'][label]){
      setInputValue(props['value'][label]);
    } else {
      try {
        const value = props['value'];
        const options = props['options'];
        setInputValue(options.find(x=>x['id']===value)[label]);
      } catch (error) { setTimeout(() => setInputValue(''), 0) };
    }
  }, [props['component']]);

  const renderInput = (param) => {
    ////////////////////////////
    const onFocus = (value) => {
      if(props['onFocus']){
        props.onFocus(value)
      }
    }
    ////////////////////////////
    return (
      <MuiTextField
        {...param} 
        margin={'dense'}
        label={props['label']}
        required={props['required']}
        onFocus={(value)=>onFocus(value)}
        readOnly={!props['selectOnly'] ? props['readOnly'] : true}
        InputProps={{...param.InputProps, endAdornment: renderInputButton()}}
      />
    )
  }

  const renderInputButton = () => {
    return (
      <Button className={styles['input-button']} disableFocusRipple={true} tabIndex={-1}>
        {renderIconButton()}
      </Button>
    )
  }

  const renderIconButton = () => {
    if(!inputValue || props['disableClearable']){
      return (<DownIcon size={'18px'} onClick={()=>resetSelectOpen()}/>)
    } else {
      return (<CloseIcon size={'17px'} onClick={()=>resetSelectValue()}/>)
    }
  }
  
  const renderPaperComponent = (props) => {
    return (
      <Paper {...props} className={styles['options-paper']}>
        <MuiScrollbar {...props} className={styles['options-scrollbar']}>
          {props['children']}
        </MuiScrollbar>
      </Paper>
    )
  };

  const renderOption = (option, param) => {
    const value = param['inputValue'];
    const label = props['optionLabel'];
    const subLabel = props['optionSubLabel'];
    ////////////////////////////////////////
    const symbolMatch = match(option[label], value);
    const symbolParse = parse(option[label], symbolMatch);
    ////////////////////////////////////////
    return (
      <div className={styles['option']}>
        <div data-role={'label'}>
          {symbolParse.map((symbol, index) => {
            const highlight = props['highlight'] && symbol['highlight'];
            return (
              <span key={index} className={highlight && styles['highlight']}>
                {symbol['text']}
              </span>
            )
          })}
        </div>
        {/* ////////////// */}
        {option[subLabel] ? 
          <div data-role={'sub-label'}>
            <span>{option[subLabel]}</span>
          </div> : null
        }
        {/* ////////////// */}
      </div>
    )
  };

  const renderNoOptionsText = () => {
    return (
      <div>
        <div className={styles['options-skeleton']}>
          <MuiSkeleton width={'250px'} height={'3px'}
            animation={'wave'} className={styles['skeleton']}
          />

          <MuiSkeleton width={'100px'} height={'3px'}
            animation={'wave'} className={styles['skeleton']}
          />
        </div>
      </div>
    )
  };

  const resetSelectOpen = () => {
    if(!props['readOnly']){
      setOpen(!open);
    }
  };

  const resetSelectValue = () => {
    if(!props['readOnly']){
      if(!props['multiple']){
        onValueChange(null);
      }
    }
  };

  const onInputChange = (value) => {
    if(!props['selectOnly']){
      setInputValue(value);
      if(props['onInputChange']){
        props.onInputChange(value);
      }
    }
  };

  const onValueChange = (value) => {
    if(props['onChange']){
      props.onChange(value)
    }
  };

  const getOptionLabel = (option) => {
    const label = props['optionLabel'];
    return option[label] ? option[label] : '';
  };

  return (
    <Autocomplete
      open={open}
      value={props['value']}
      inputValue={inputValue}
      multiple={props['multiple']}
      onBlur={()=>setFocus(false)}
      onFocus={()=>setFocus(true)}
      options={(props['options'] || [])}
      PaperComponent={renderPaperComponent}
      filterOptions={(options, state)=>options}
      onChange={(event, value)=>onValueChange(value)}
      getOptionLabel={(option)=>getOptionLabel(option)}
      disableCloseOnSelect={props['multiple'] ? true : false}
      renderOption={(option, param)=>renderOption(option, param)}
      onInputChange={(event, value, reason)=>onInputChange(value)}
      onOpen={()=>props['readOnly'] ? setOpen(false) : setOpen(true)}
      className={Clsx(styles['mui-autocomplete'], props['className'])}
      onClose={()=>props['readOnly'] ? setOpen(false) : setOpen(false)}
      selectOnFocus={props['readOnly'] || props['selectOnly'] ? false : true}
      classes={{noOptions: styles['no-options-paper'], option: styles['option']}}
      renderInput={(param)=>renderInput(param)} noOptionsText={renderNoOptionsText()}
      getOptionSelected={(option, value)=>(option['id'] && value['id']) ? option['id'] === value['id'] : true}
    />
  )
})