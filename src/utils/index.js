export const rangeOfStep = (h) => {
  if (h >= 4 && h < 16) return 0;
  if (16 <= h || h < 4) return 1;
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
