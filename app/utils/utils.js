export function decadeToPeriod (decade) {
  return decade + ' - ' + (parseInt(decade) + 24)
}

export function formatNumber (number) {
  return number
    .toString()
    .split('')
    .reverse()
    .join('')
    .match(/.{1,3}/g)
    .join('.')
    .split('')
    .reverse()
    .join('')
}
