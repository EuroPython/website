export const numberToTime = (number: number) => {
  const hours = Math.floor(number / 60);
  const minutes = number % 60;

  const hoursString = hours < 10 ? `0${hours}` : `${hours}`;
  const minutesString = minutes < 10 ? `0${minutes}` : `${minutes}`;

  return `${hoursString}:${minutesString}`;
};

export const timeToNumber = (time: string) => {
  const [hour, minute] = time.split(":");
  const hourInt = parseInt(hour, 10);
  const minuteInt = parseInt(minute, 10);
  return hourInt * 60 + minuteInt;
};
