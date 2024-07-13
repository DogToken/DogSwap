import React from "react";



export default function LoadingButton(props) {
  const { children, loading, valid, success, fail, onClick, ...other } = props;
  return (
    <div>
      <button
        variant="contained"
        color="primary"
        fullWidth
        disabled={loading || !valid}
        type="submit"
        onClick={onClick}
        {...other}
      >
        {children}
      </button>
      {loading && <div />}
    </div>
  );
}