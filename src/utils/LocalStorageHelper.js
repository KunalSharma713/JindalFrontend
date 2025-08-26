const LocalStorageHelper = {
  getItem: (key) => {
    try {
      const item = localStorage.getItem(key);
      return JSON.parse(item);
    } catch (error) {
      console.log(error?.message);
      return null;
    }
  },

  setItem: (key, value) => {
    try {
      const item = JSON.stringify(value);
      localStorage.setItem(key, item);
    } catch (error) {
      console.log(error?.message);

      return error;
    }
  },

  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.log(error?.message);
    }
  },

  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.log(error?.message);
    }
  },
};

export default LocalStorageHelper;
