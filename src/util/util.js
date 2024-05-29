import storageService from '@/core/storage';

export const getOrganizationId = () => {
  const user = JSON.parse(storageService.get('user'));
  return user.organizationId;

  //return 'c1c011d3-e9db-4874-9d90-e267c64dd9da'   // dummy organization id
};

export function getRandomHexColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function removeDuplicates(array) {
  const seen = {};
  return array.filter(item => {
      const key = JSON.stringify(item);
      return seen.hasOwnProperty(key) ? false : (seen[key] = true);
  });
}
export const removeDuplicateFromArray = (arr, key) => {
  const tracker = new Set();
  const res = []
  arr.forEach(ele=>{
    if(!tracker.has(ele[key])){
      res.push(ele);
      tracker.add(ele[key])
    }
  })
  return res;
}

export const setUniqueClassColors = (allClasses) => {
  const classes = new Map();

  const uniqueClasses = removeDuplicates(allClasses);
  uniqueClasses.forEach((data, i) => {
    classes.set((data?.id || data), {
      name: data?.name || data,
      color: `color-${(i % 10) + 1}`
    })
  })

  return classes;
}