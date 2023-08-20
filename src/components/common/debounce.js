export const debounce = (value, fun, delay = 700) => {
    clearTimeout(window._timerId);
    window._timerId = setTimeout(() => {
      fun(value);
    }, delay);
  };
