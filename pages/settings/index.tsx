import React from 'react';
import { AuthControl } from '@services/routing';

import { observer } from 'mobx-react-lite';
import { RootStore } from '@store/RootStore';

import { getSnapshot } from 'mobx-state-tree';

import { types } from 'mobx-state-tree';
import { MainLayouts } from '@layouts/MainLayouts';
import { PageSettings } from '@app/settings/PageSettings';

const index = observer((props) => (
  <MainLayouts>
    <PageSettings {...props}/>
  </MainLayouts>
))

export const getServerSideProps = async (context) => {
  ////////////////////////////////////////////////////
  await AuthControl(context);
  const session = RootStore['session'];
  ////////////////////////////////////////////////////
  return {props: {model: {...getSnapshot(session['user'])}}};
}

export default index;