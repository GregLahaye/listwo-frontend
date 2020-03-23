import React, { useEffect, useRef, useState } from "react";

const Editable = ({
  name,
  placeholder,
  value,
  setValue,
  updateValue,
  fontSize,
}) => {
  const [editing, setEditing] = useState(false);
  const [changed, setChanged] = useState(false);
  const input = useRef();

  useEffect(() => {
    if (input.current) {
      input.current.focus();
    }
  }, [editing]);

  const handleChange = (e) => {
    setChanged(true);

    setValue(e.target.value);
  };

  const handleBlur = () => {
    setEditing(false);

    if (changed) {
      updateValue();
    }
  };

  return editing ? (
    <input
      type="text"
      ref={input}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      className="form-control"
      style={{ height: "auto", fontSize }}
    ></input>
  ) : (
    <button
      className="btn w-100 text-left"
      onClick={() => setEditing(true)}
      style={{ height: "auto", fontSize }}
    >
      {value}
    </button>
  );
};

export default Editable;
