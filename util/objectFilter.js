module.exports = () => {
  if (!Object.prototype.filter) {
    function filter(predicate) {
      const obj = this;
      console.log("hello");
      if (Object.prototype.toString.call(obj) !== "[object Object]") {
        throw new Error(
          "Cannot invkoke filter method beacuse input is not a object."
        );
      }
      const newObj = {};
      for (let prop in obj) {
        if (obj.hasOwnProperty(prop) && predicate(prop, obj[prop], obj)) {
          newObj[prop] = obj[prop];
        }
      }
      return newObj;
    }
    Object.defineProperty(Object.prototype, "filter", {
      value: filter,
      writable: true,
      configurable: true,
    });
  }
};
