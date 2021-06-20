import React from 'react';

import { observer } from 'mobx-react-lite';

import { MuiScrollbar } from '@components/core';

import SimpleReactLightbox from 'simple-react-lightbox';

import { MessageItem } from './mesage-item/MessageItem';

export const MessagesList = React.memo<any>(observer(({ messages }) => {
  const refSrollBar = React.useRef(null);
  React.useEffect(() => {
      const scroll = setInterval(() => {
      if (refSrollBar['current']?.['scrollValues']?.['scrollTop'] === 0) {
        refSrollBar['current'].scrollToBottom();
      } else {
        refSrollBar['current'].scrollToBottom()
        clearInterval(scroll);
      }
      return () => clearInterval(scroll);
    }, 0);
  });

  return (
  <SimpleReactLightbox>
    <MuiScrollbar ref={refSrollBar}>

      {messages.map((row, index) => <MessageItem key={row['id']} row={row} index={index} messages={messages}/>)}
      
    </MuiScrollbar>
  </SimpleReactLightbox>
  )
}))