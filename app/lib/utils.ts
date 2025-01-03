export function convertHrToHrMin(cookTimeMin: number) {
  let cookTimeHr = 0;
  let leftoverCookTimeMin = cookTimeMin;

  while (leftoverCookTimeMin - 60 > 59) {
    ++cookTimeHr;
    leftoverCookTimeMin -= 60;
  }
  
  return { cookTimeHr, leftoverCookTimeMin };
}