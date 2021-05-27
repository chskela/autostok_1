export { debounce as debounce } from 'lodash';
import { getNookie } from 'next-nookies-persist';

////////////////////////
const devURL = 'http://127.0.0.1:3093';
const prodURL = 'http://185.200.241.225:3093';
// const prodURL = 'http://'+process['env']['LOCAL_IP']+':3093';
const serverURL = process['env']['NODE_ENV'] === 'production' ? prodURL : prodURL;
////////////////////////

export const maxAge = 60*60*24*365*10;
export const request = async (url, body, context=null) => {
  try {
    const response = await fetch(serverURL+url, 
      {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          'Certificate': getNookie('certificate', context),
        }
      }
    )
    const result = await response.json();
    ////////////////////////
    if(!response['ok']){
      if(response['status'] !== 403){
        if(response['status'] !== 503){
          !context ? alert(result['error']) : console.log(result['error']);
        }
      }
    };
    ////////////////////////
    return response['ok'] ? {
      'data': result,
      'status': response['status']
    } : {
      'data': result['error'],
      'status': response['status']
    }
    ////////////////////////
  } catch (error) {
    ////////////////////////
    !context ? alert(error['message']) : console.log(error['message']);
    ////////////////////////
    return {
      'status': 503,
      'data': error['message']
    }
  }
}

export const requestStorage = async (url, file, onProgress=null) => {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    const request = new XMLHttpRequest();
    
    form.append('file', file);
    request.responseType = 'json';
    request.open('POST', serverURL+url);
    request.setRequestHeader('Certificate', getNookie('certificate'));
    ////////////////////////
    request.upload.onprogress = (event) => {
      if(onProgress){
        onProgress(event.loaded, event.total)
      }
    }
    ////////////////////////
    request.upload.onerror = () => {
      resolve({'status': request['status'], data: null})
    }
    ////////////////////////
    request.onload = () => {
      resolve({'status': request['status'], data: request['response']})
    }
    ////////////////////////
    request.send(form);
  })
}