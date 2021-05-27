import React from 'react';
import { ServerStyleSheets } from '@material-ui/core/styles';
import Document, { Html, Head, Main, NextScript } from 'next/document';

class NextDocument extends Document {
  render(){    
    return (
      <Html lang='ru'>
        <title>{'AUTOSTOK'}</title>
        <Head>
          {this['props']['materialStyle']}
          <meta name='theme-color' content='#000000'/>
          <link href='//fonts.gstatic.com' rel='preconnect' crossOrigin='anonymous'/>
          <link href='//fonts.googleapis.com/css?family=Roboto:300,400,500,600,700,800,900&display=swap' rel='stylesheet'/>
        </Head>
        <body>
          <Main/>
          <NextScript/>
        </body>
      </Html>
    )
  }
}

NextDocument.getInitialProps = async (ctx) => {
  const render = ctx['renderPage'];
  const sheets = new ServerStyleSheets();
  ///////////////////////////////////////
  ctx.renderPage = () => render({
    enhanceApp: (App) => (props) => sheets.collect(<App {...props}/>)
  });
  ///////////////////////////////////////
  const id = 'jss-server-side';
  const initialProps = await Document.getInitialProps(ctx);
  const styles = sheets.toString().replace(/\r?\n/g, '').replace(/\s{2,}/g, ' ');
  ///////////////////////////////////////
  return {
    ...initialProps,
    materialStyle: [...React.Children.toArray(initialProps.styles), <style key={id} id={id}>{styles}</style>],
  };
};

export default NextDocument;