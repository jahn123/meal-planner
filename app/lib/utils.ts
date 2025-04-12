export function convertMinToHrMin(cookTimeMin: number) {
  let cookTimeHr = 0;
  let leftoverCookTimeMin = cookTimeMin;

  while (leftoverCookTimeMin - 60 >= 0) {
    ++cookTimeHr;
    leftoverCookTimeMin -= 60;
  }
  
  return { cookTimeHr, leftoverCookTimeMin };
}

export function convertHrMinToMin(cookTimeHr: number | undefined, cookTimeMin: number | undefined) {
  if (!cookTimeHr && !cookTimeMin) {
    return undefined;
  }
  if (!cookTimeHr) {
    return cookTimeMin;
  }
  else if (!cookTimeMin) {
    return cookTimeHr * 60;
  }

  return cookTimeHr * 60 + cookTimeMin;
}