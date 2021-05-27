import React from 'react';
import Router from 'next/router';
import styles from './class.module.css';

import { useRouter } from 'next/router';

import { Clsx } from '@components/core';
import { observer } from 'mobx-react-lite';
import { MuiTextField, MuiButton } from '@components/core';

import { LoginModel } from '@models/login/LoginModel';

export const PageLogin = observer((props) => {
  const router = useRouter();
  const [ model ] = React.useState(LoginModel.create());

  return (
    <div className={'flex flex-col flex-1'}>
      <div className={'flex flex-col flex-1 items-center justify-center bg-gray-100'}>
      
        <div className={'w-96 h-max p-8 bg-white rounded-lg shadow-xl'}>
          <MuiTextField
            label={'Login'}
            value={model['login']}
            className={'!mt-[10px]'}
            onChange={(value)=>model.changeControl('login', value)}
          />

          <MuiTextField
            type={'password'}
            label={'Password'}
            className={'!mt-[10px]'}
            value={model['password']}
            onChange={(value)=>model.changeControl('password', value)}
          />

          <MuiButton
            label={'Войти'}
            loading={model['isFetching']}
            className={'mx-[auto] mt-[10px]'}
            onClick={async()=>{ 
              const response = await model.controlLogin({});
              response['status'] === 200 && router.push('/');
            }}
          />
        </div>

      </div>
    </div>
  )
})