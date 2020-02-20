import TokenService from '../Services/token-service';
import config from '../config';

const AssignmentsApiService = {
  getAllAssignments() {
    fetch(config.API_ENDPOINT_ASSIGNMENTS, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `basic ${TokenService.getAuthToken()}`,
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status)
      }
      return response.json()
    })
  },
};

export default AssignmentsApiService;