import storageService from '@/core/storage';

export const getOrganizationId = () => {
  const user = JSON.parse(storageService.get('user'));
  return user.organizationId;

  //return 'c1c011d3-e9db-4874-9d90-e267c64dd9da'   // dummy organization id
};

export function getRandomHexColor(brightness = null) {
  const letters = '0123456789ABCDEF';
  let color = '#';
  if(!brightness){
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
  }else{
    const isDark = brightness < 128;
    for (let i = 0; i < 6; i++) {
      let randomIndex;
      if (isDark) {
        randomIndex = Math.floor(Math.random() * 10) + 6;
      } else {
        randomIndex = Math.floor(Math.random() * 10);
      }
      color += letters[randomIndex];
    }
  }
  return color;
}

export function removeDuplicates(array) {
  const seen = {};
  return array.filter((item) => {
    const key = JSON.stringify(item);
    return seen.hasOwnProperty(key) ? false : (seen[key] = true);
  });
}
export const removeDuplicateFromArray = (arr, key) => {
  const tracker = new Set();
  const res = [];
  arr.forEach((ele) => {
    if (!tracker.has(ele[key])) {
      res.push(ele);
      tracker.add(ele[key]);
    }
  });
  return res;
};

export const setUniqueClassColors = (allClasses) => {
  const classes = new Map();

  const uniqueClasses = removeDuplicates(allClasses);
  uniqueClasses.forEach((data, i) => {
    classes.set(data?.id || data, {
      name: data?.name || data,
      color: `color-${(i % 10) + 1}`,
    });
  });

  return classes;
};

const arraysEqual = (a, b) => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

export const compareArrays = (annotRects, iniLabels) => {
  let flag = false;

  for (let rect of annotRects) {
    let initialLabel = iniLabels.find((label) => label.uuid === rect.uuid);
    if (initialLabel) {
      if (
        rect?.title !== initialLabel?.title ||
        rect?.x !== initialLabel?.x ||
        rect?.y !== initialLabel?.y ||
        rect?.width !== initialLabel?.width ||
        rect?.height !== initialLabel?.height ||
        !arraysEqual(rect?.points || [], initialLabel?.points || [])
      ) {
        flag = true;
        break;
      }
    } else {
      flag = true;
      break;
    }
  }
  return flag;
};

export function validateRegexString(input) {
  const allowedPattern = /^[a-zA-Z0-9 ]+$/;

  if (allowedPattern.test(input)) {
    return '';
  }

  const invalidCharacters = new Set();
  for (let char of input) {
    if (!/[a-zA-Z0-9 ]/.test(char)) {
      invalidCharacters.add(char);
    }
  }

  let errorMessage = `Invalid characters: '${Array.from(invalidCharacters).join(', ')}' ${Array.from(invalidCharacters).length > 1 ? 'are' : 'is'} not allowed.`;

  return errorMessage;
}

export function getAverageBrightness(img) {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, img.width, img.height);
  const data = imageData.data;

  let totalBrightness = 0;
  const totalPixels = data.length / 4;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Calculate brightness using the luminance formula
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    totalBrightness += brightness;
  }

  const avgBrightness = totalBrightness / totalPixels;
  return avgBrightness;
}
