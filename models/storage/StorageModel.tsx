import { types } from 'mobx-state-tree';
import { applySnapshot } from 'mobx-state-tree';
import { requestStorage } from '@services/request';
import { actionsHooks, volatileHooks } from '@models/hooks';

export const StorageModel = types.model({
  id: types.maybeNull(types.string),
  uploaded: types.maybeNull(types.Date),
  file_id: types.maybeNull(types.string),
  filename: types.maybeNull(types.string),
  public_url: types.maybeNull(types.string),
  content_type: types.maybeNull(types.string),
  content_length: types.maybeNull(types.integer),
}).volatile(self => ({
  ...volatileHooks(self),
  progress: 0,
})).actions(self =>({
  ...actionsHooks(self),
  changeControl(contol, value){
    self[contol] = value;
  },
  uploadModel(url, file){
    return new Promise((resolve, reject) => {
      requestStorage(url, file, (progress, total)=>{
        const uploadProgress = progress / total;
        this.changeControl('progress', Math.floor(uploadProgress * 100));
      }).then((response) => {
        if(response['status'] === 200){
          applySnapshot(self, response['data'][0]);
        }
        setTimeout(() => resolve(response), 0);
      })
    })
  },
})).preProcessSnapshot((snapshot) => {
  return {...snapshot}
})