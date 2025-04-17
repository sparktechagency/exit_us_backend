function minutesBetween(date1:string, date2:string) {
    const firstDate:any = new Date(date1);
    const secondDate:any = new Date(date2);
    const diffInMs = Math.abs(firstDate - secondDate);
    const diffInMinutes = diffInMs / 1000 / 60;
    return diffInMinutes
  }

export  const timeHelper = {
    minutesBetween
}