export const rangeOfStep = (h) => {
  if (h >= 1 && h < 12) return 0;
  if (12 <= h && h < 18) return 1;
  return 2;
};

export const hadRetire = (firestoreTime) => {
  if (firestoreTime) {
    const now = new Date();
    const retire = new Date(firestoreTime.toDate());
    const newStamp = new Date(now.getFullYear(), now.getMonth(), now.getDate(),0 , 0, 0).getTime();
    const retireStamp = new Date(retire.getFullYear(), retire.getMonth(), retire.getDate(),0 , 0, 0).getTime() + 86400000;
    return newStamp >= retireStamp;
  }
  return false
}

export const BACK_METHODS = {
  FAMILY: "FAMILY",
  FRIEND: "FRIEND",
  BUS: "BUS",
  SELF: "SELF"
};
