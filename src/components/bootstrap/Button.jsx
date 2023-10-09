import React from "react";

function Button({ color, size, onClick, icon, isLoading, disabled, children }) {
  return (
    <button
      className={`btn btn-${color} btn-${size}`}
      disabled={disabled}
      onClick={onClick}
    >
      <i className={icon}></i>&nbsp;{children}&nbsp;
      {isLoading && (
        <span
          class="spinner-grow spinner-grow-sm"
          role="status"
          aria-hidden="true"
        ></span>
      )}
    </button>
  );
}

export default Button;
