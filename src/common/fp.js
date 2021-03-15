export function h0 (timestaps = Date.now()) {
  let target = new Date(timestaps)
  
  target.setHours(0,0,0,0)
  // target.setMinutes(0)
  // target.setSeconds(0)
  // target.setMilliseconds(0)
  return target
}