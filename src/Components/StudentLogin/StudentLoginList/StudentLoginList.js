import React from "react";
import { NavLink } from "react-router-dom";
import StudentLogin from "../StudentLogin/StudentLogin";
import PropTypes from "prop-types";

export default function StudentLoginList(props) {
  const { students } = props;

  const studentList = students.map(student => (
    <li key={student.user_id}>
      <StudentLogin student={student} />
    </li>
  ));

  return (
    <section className="section-page">
      <h1>Student Logins</h1>
      <div className="StudentLogin">
        <ul>{studentList}</ul>

        {students.length > 0 ? (
          ""
        ) : (
          <NavLink to={`/users/${props.match.params.user_id}/studentlogin`}>
            <div className="StudentLogin-button button">Add Student</div>
          </NavLink>
        )}
      </div>
    </section>
  );
}

StudentLoginList.defaultProps = {
  students: []
};

StudentLoginList.propTypes = {
  students: PropTypes.array.isRequired
};
