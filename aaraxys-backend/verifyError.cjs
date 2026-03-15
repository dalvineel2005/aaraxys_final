const axios = require('axios');
axios.post('http://127.0.0.1:5000/api/auth/register', { name: "A", email: "a@a.com", password: "pwd" })
  .then(r => console.log('SUCCESS', r.data))
  .catch(err => {
    console.log('STATUS:', err.response?.status);
    console.log('DATA:', err.response?.data);
    console.log('MESSAGE:', err.message);
  });
