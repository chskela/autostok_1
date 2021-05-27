import React from 'react';
import Head from 'next/head'
import colors from '@config/colors.module.css';
import { createMuiTheme } from '@material-ui/core';
import { StylesProvider } from '@material-ui/core';
import { createGenerateClassName } from '@material-ui/core';
import { MuiThemeProvider, CssBaseline } from '@material-ui/core';

import { RootStore } from '@store/RootStore';
import { useUserAgent } from 'next-useragent';
import { applySnapshot } from 'mobx-state-tree';

import '@config/app.css';
import 'tailwindcss/tailwind.css';
import 'animate.css/animate.compat.css';

export const configProvider = {
  injectFirst: true,
  generateClassName: createGenerateClassName({
    // disableGlobal: process['env']['NODE_ENV'] === 'production' ? false : false,
    // productionPrefix: process['env']['NODE_ENV'] === 'production' ? 'css' : null,
  }) 
}

export const MuiTheme = createMuiTheme({
  palette: {
    primary: {
      main: colors['primary']
    }
  }
})

const NextApp = (props) => {
  const { Component } = props;
  //React.useLayoutEffect = React.useEffect;
  props['router']['isSsr'] && applySnapshot(RootStore, props['RootStore']);
  React.useEffect(() => { props['userAgent']['isMobile'] && RootStore.changeControl('isMobile', true) }, []);

  return (
    <React.Fragment>
      <Head>
        <meta name='viewport' content='width=device-width, user-scalable=no'/>
      </Head>

      <MuiThemeProvider theme={MuiTheme}>
        <StylesProvider {...configProvider}>
          <CssBaseline/>
          <Component {...props['pageProps']}/>
        </StylesProvider>
      </MuiThemeProvider>
    </React.Fragment>
  )
}

NextApp.getInitialProps = async (ctx) => {
  ///////////////////////////////////
  const context = ctx['ctx'];
  const headers = context['req']['headers'];
  const userAgent = useUserAgent(headers['user-agent']);
  ///////////////////////////////////
  if (context['pathname'] === '/') {
    const url = '/direct';
    const param = {location: url};
    context['res'].writeHead(302, param);
    setTimeout(() => context['res'].end(), 0);
  }
  ///////////////////////////////////
  const {menu, ...store} = RootStore;
  return { RootStore: store, userAgent: userAgent };
};

export default NextApp;