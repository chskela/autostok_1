import React from 'react';
import { getQuery } from '@services/routing';
import { AuthControl } from '@services/routing';

import { observer } from 'mobx-react-lite';
import { DirectList } from '@models/direct/DirectList';
import { DirectMessagesList } from '@models/direct/DirectList';
import { getSnapshot, applySnapshot } from 'mobx-state-tree';

import { MainLayouts } from '@layouts/MainLayouts';
import { PageDirect } from '@app/direct/PageDirect';

const index = observer((props) => (
  <MainLayouts>
    <PageDirect {...props}/>
  </MainLayouts>
))

export const getServerSideProps = async (context) => {
  ////////////////////////////////////////////////////
  await AuthControl(context);
  const query = getQuery(context);
  const direct = DirectList.create();
  const messages = DirectMessagesList.create();
  ////////////////////////////////////////////////////
  const select = query['select'];
  await direct.initialModel({context: context});
  await messages.initialModel({context: context, direct: select});
  return {props: {direct: {...getSnapshot(direct)}, messages: {...getSnapshot(messages)}}};
}

export default index;