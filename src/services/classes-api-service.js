import config from '../config';
import TokenService from './token-service';

const ClassesApiService = {
  getAll() {
    return fetch(config.API_ENDPOINT_CLASSES, {
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
  addClass(newSchoolClass) {
    return fetch(config.API_ENDPOINT_CLASSES, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `bearer ${TokenService.getAuthToken()}`,
      },
      body: JSON.stringify(newSchoolClass)
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      )
  },
  updateClass(updatedSchoolClass) {
    return fetch(config.API_ENDPOINT_CLASSES + `/${updatedSchoolClass.class_id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `bearer ${TokenService.getAuthToken()}`,
      },
      body: JSON.stringify(updatedSchoolClass),
    })
  },
  deleteClass(class_id) {
    return fetch(config.API_ENDPOINT_CLASSES + `/${class_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `bearer ${TokenService.getAuthToken()}`,
      }
    })
  }
};

export default ClassesApiService;