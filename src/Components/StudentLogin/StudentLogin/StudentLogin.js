import React from "react";

export default function StudentLogin(props) {
  const { student } = props;

  return (
    <div>
      <span className="StudentLogin__name">Username: </span>
      {student.user_name}
    </div>
  );
}
