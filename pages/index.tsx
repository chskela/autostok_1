import React from 'react';
import { MainLayouts } from '@layouts/MainLayouts';

import { observer } from 'mobx-react-lite';

const index = observer((props) => {
  return (
    <MainLayouts>

    </MainLayouts>
  )
})

export const getServerSideProps = async (context) => {
  return {props: {}};
}

export default index;