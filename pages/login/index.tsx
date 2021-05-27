import React from 'react';
import { observer } from 'mobx-react-lite';

import { PageLogin } from '@app/login/PageLogin';

const index = observer((props) => (
  <PageLogin {...props}/>
))

export default index;