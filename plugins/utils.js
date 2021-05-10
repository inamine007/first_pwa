/***
  日付をフォーマットする
  引数：日付
***/
const getNow = (d) => {
  return d.getFullYear() + '-' + (d.getMonth() + 1).toString().padStart(2, '0') + '-' + 
         d.getDate().toString().padStart(2, '0') + ' ' + d.getHours().toString().padStart(2, '0') + ':' + 
         d.getMinutes().toString().padStart(2, '0') + ':' + d.getSeconds().toString().padStart(2, '0');
}

/***
  時間を返す
  引数：日付
***/
const getTime = (d) => {
  return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0')
         + ':' + d.getSeconds().toString().padStart(2, '0');
}

/***
  日付をid用に区切り文字なしでフォーマットする
  引数：日付
***/
const getNowById = (d) => {
  return d.getFullYear() + (d.getMonth() + 1).toString().padStart(2, '0') + 
         d.getDate().toString().padStart(2, '0') + d.getHours().toString().padStart(2, '0') + 
         d.getMinutes().toString().padStart(2, '0') + d.getSeconds().toString().padStart(2, '0');
}

/***
  0埋め
  引数：第一(数値),第二(桁数)
***/
const zeroPadding = (num, len) => {
  return ( Array(len).join('0') + num ).slice( -len );
}

/***
  消費税加算
  引数：税抜値段
***/
const taxCalc = (priceBeforeTax) => {
  let tax = 1.1;
  let price = priceBeforeTax * tax;
  let priceAfterTax = Math.round(price);
  return priceAfterTax;
}

/***
  消費税減算
  引数：税込値段
***/
const taxExcl = (priceAfterTax) => {
  let tax = 1.1;
  return Math.round(priceAfterTax / tax);
}

export default ({app}, inject) => {
  inject('getNow', getNow);
  inject('getTime', getTime);
  inject('getNowById', getNowById);
  inject('zeroPadding', zeroPadding);
  inject('taxCalc', taxCalc);
  inject('taxExcl', taxExcl);
}