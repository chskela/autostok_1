import Router from 'next/router';
import { RootStore } from '@store/RootStore';
import { applySnapshot } from 'mobx-state-tree';

import { parse } from 'qs';
import { request } from '@services/request';
import { decoder } from '@services/general';

export const getQuery = (context) => {
  let result = [];
  for(let key in context['query']) {
    const value = context['query'][key];
    result.push(String(key)+'='+String(value));
  };
  return parse(result.join('&'), {decoder});
}

export const AuthControl = async (context) => {
  ////////////////////////////////////////////////////
  const session = RootStore['session'];
  const response = await request('/auth', {}, context);
  ////////////////////////////////////////////////////
  if(response['status'] === 403){
    const param = {location: '/login'};
    context['res'].writeHead(302, param);
    setTimeout(() => context['res'].end(), 0);
  } else if (response['status'] === 200){
    applySnapshot(session['user'], response['data']);
  }
  return response;
}

export const RouterLoading = (setLoading) => {
  const routeChange = (value) => setLoading(value);
  Router['events'].on('routeChangeStart', ()=>routeChange(true));
  Router['events'].on('routeChangeError', ()=>routeChange(true));
  Router['events'].on('routeChangeComplete', ()=>routeChange(false));
  return () => {
    Router['events'].off('routeChangeStart', ()=>routeChange(false));
    Router['events'].off('routeChangeError', ()=>routeChange(false));
    Router['events'].off('routeChangeComplete', ()=>routeChange(false));
  }
};