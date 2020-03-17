import config from '../config';
import TokenService from './token-service';

const AssignmentsApiService = {
  getAll() {
    return fetch(config.API_ENDPOINT_ASSIGNMENTS, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `bearer ${TokenService.getAuthToken()}`,
      }
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      )
  },
  addAssignment(assignment) {
    return fetch(config.API_ENDPOINT_ASSIGNMENTS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `bearer ${TokenService.getAuthToken()}`
      },
      body: JSON.stringify(assignment)
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      )
  },
  updateAssignment(updatedAssignment) {
    const url = config.API_ENDPOINT_ASSIGNMENTS + `/${updatedAssignment.assignment_id}`;

    return fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `bearer ${TokenService.getAuthToken()}`
      },
      body: JSON.stringify(updatedAssignment)
    })
  },
  deleteAssignment(assignment_id) {
    return fetch(config.API_ENDPOINT_ASSIGNMENTS + `/${assignment_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `bearer ${TokenService.getAuthToken()}`,
      }
    })
  }
};

export default AssignmentsApiService;