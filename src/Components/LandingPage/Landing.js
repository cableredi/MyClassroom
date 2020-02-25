import React from 'react';
import { useHistory } from 'react-router-dom';
import AuthApiService from '../../Services/auth-api-service';

/***********************/
/* handleSubmitJWTAuth */
/***********************/
function handleSubmitJwtAuth(userName, password, history) {
  AuthApiService.postLogin({
    user_name: userName,
    password: password,
  })
    .then(res => {
      history.push('/calendar');
    })
    .catch(res => {
      console.log('there was an error', res);
    })
}

export default function Landing() {
  let history = useHistory();

  return (
    <section className='section-page'>
      <header role="banner">
        <h1 className='Landing__header'>MyClassroom</h1>
      </header>
      <div className='Landing__contents'>
        My Classroom is a simple and effective way for teachers/professors/tutors/etc to effectively communicate to his/her students the upcoming assignments, tests, quizzes, projects, etc.
      </div>
      
      <div className="Landing__images">
        <div className="Landing__image">
          Image 1
        </div>
        <div className="Landing__image">
          Image 2
        </div>
        <div className="Landing__image">
          Image 3
        </div>
      </div>

      <div className='Landing__contents'>
        <p>My Classroom is easy to use</p>
        <p>
          Teachers: Just add your assignments and your students will be able to see what's up next
        </p>
        <p>
          Students: Just log in and view the Calendar to see what is coming up
        </p>
        <p>
          Parents: Just log in as your student and you can see what your child's assignments are to help keep them on track
        </p>
      </div>

      <div className='Landing__demo'>
        <h1>Try it out</h1>
        <h2>Log in as either a teacher or student</h2>
        <button
          onClick={ () => {handleSubmitJwtAuth('teacher', 'teacher', history)} }
        >
          Teacher
        </button>
        <button
          onClick={ () => {handleSubmitJwtAuth('student', 'student', history)} }
        >
          Student
        </button>
      </div>
    </section>
  )
}