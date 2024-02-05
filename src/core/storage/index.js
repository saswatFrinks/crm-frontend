// TODO: change storage like localstorage, cookie, session
const storageService = {
  get: (key) => {
    return localStorage.getItem(key) ?? null;
  },
  set: (key, value) => {
    return localStorage.setItem(key, JSON.stringify(value));
  },
};

export default storageService;
