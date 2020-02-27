export default function getUTCDate(origDate) {
  let date = new Date(origDate);

  return new Date(date.getTime() + date.getTimezoneOffset()*60*1000);
}