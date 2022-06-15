import axios from 'axios';

// axios is async

export default axios.create({
  baseURL: 'http://localhost:3001/api',
});
