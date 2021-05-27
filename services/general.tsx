
export const decoder = (str, decoder, charset) => {
  const strPlus = str.replace(/\+/g, ' ');
  if (charset === 'iso-8859-1') {
    return strPlus.replace(/%[0-9a-f]{2}/gi, unescape)
  };

  if (/^(\d+|\d*\.\d+)$/.test(str)) { return parseFloat(str) };
  const keywords = { true: true, false: false, null: null, undefined};
  
  if (str in keywords) { return keywords[str] }
  try { return decodeURIComponent(strPlus) } catch (e) { return strPlus }
}

export const convertIntSeparator = (value) => {
  value = value ? value : 0;
  const param = { minimumFractionDigits: 2 };
  return value.toLocaleString('en-US', {...param}).replace(/,/g, ' ');
}

export const getRandonKey = (length = 10) => {
  let result = '';
  const dictionary = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const dictionaryLength = dictionary.length;
  for (let i = 0; i < length; i++) {
     result += dictionary.charAt(Math.floor(Math.random() * dictionaryLength));
  }
  return result;
}

export const getRandonString = (length = 10) => {
  let result = '';
  const dictionary = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const dictionaryLength = dictionary.length;
  for (let i = 0; i < length; i++) {
     result += dictionary.charAt(Math.floor(Math.random() * dictionaryLength));
  }
  return result;
}

export const hex2rgba = (hex, alpha = 1) => {
  hex = hex.replace('#', '');
  let r = parseInt(hex.length == 3 ? hex.slice(0, 1).repeat(2) : hex.slice(0, 2), 16);
  let g = parseInt(hex.length == 3 ? hex.slice(1, 2).repeat(2) : hex.slice(2, 4), 16);
  let b = parseInt(hex.length == 3 ? hex.slice(2, 3).repeat(2) : hex.slice(4, 6), 16);
  return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
};