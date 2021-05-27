import React from 'react';
import Router from 'next/router';

import { useRouter } from 'next/router';
import { observer } from 'mobx-react-lite';
import { applySnapshot } from 'mobx-state-tree';

import { DirectList } from '@models/direct/DirectList';
import { DirectMessagesList } from '@models/direct/DirectList';
import { RootStore } from '@store/RootStore';

export const PageDirect = observer((props) => {
  const router = useRouter();
  const [ direct ] = React.useState(DirectList.create({...props['direct']}));
  React.useEffect(() => { applySnapshot(direct, {...props['direct']}) }, [props]);
  React.useEffect(() => { applySnapshot(messages, {...props['messages']}) }, [props]);
  const [ messages ] = React.useState(DirectMessagesList.create({...props['messages']}));

  return (
    <div className={'flex flex-col flex-1'}>

      <div className={'flex flex-row flex-1'}>
        <div className={'flex flex-col w-[400px] h-[100%] border-r'}>
          <h3>PageDirect</h3>

          {direct['response'].map((row, index) => {
            const onClick = () => Router.push({pathname: router['pathname'], query: {select: row['id']}});
            return (
              <div key={index} onClick={onClick}>
                {row['id']}
                <img src={row['reception_parts'].getPreview()} width={'30px'}/>
              </div>
            )
          })}
        </div>

        <div className={'flex flex-col flex-1'}>
          <h3>ListMessages</h3>

          {messages['response'].map((row, index) => {
            return (
              <div key={index} data-sender={RootStore['session']['user']['id'] === row['sender']['id']}>{row['content']}</div>
            )
          })}
        </div>
      </div>

    </div>
  )
})