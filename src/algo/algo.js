export const getRoisAndClasses = (frontEle, rois, classes, flag) => {
  const queue = [frontEle];

  const names = [];
  const set = new Set();

  while (queue.length > 0) {
    const top = queue.shift();

    if (set.has(top)) {
      continue;
    }

    set.add(top);
    names.push(top);

    for (const ele of rois) {
      if (ele.classNames.includes(top)) {
        for (const subEle of ele.classNames) {
          if (!set.has(subEle)) {
            queue.push(subEle);
          }
        }
      }
    }
  }

  const newRois = [];
  for (const ele of rois) {
    const check = ele.classNames.some((obj) => names.includes(obj));
    if (check) {
      newRois.push({ ...ele, check: flag });
    } else {
      newRois.push(ele);
    }
  }

  const newClasses = classes.map((classObj) => {
    const check = names.includes(classObj.name);
    if (check) {
      return { ...classObj, check: flag };
    }
    return classObj;
  });

  return [newRois, newClasses];
};
