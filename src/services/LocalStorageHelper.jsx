const LocalStorageHelper = {
  getItem: (key) => {
    try {
      const item = localStorage.getItem(key);

      return JSON.parse(item);

    } catch (error) {
      return error;
    }
  },

  setItem: (key, value) => {
    try {
      const item = JSON.stringify(value);
      localStorage.setItem(key, item);
    } catch (error) {
      return error
    }

  },

  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      return error
    }
  },

  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      return error
    }
  },
};

export default LocalStorageHelper;
