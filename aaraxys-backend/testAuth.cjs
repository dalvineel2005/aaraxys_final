const axios = require('axios');
const fs = require('fs');

async function testAuth() {
    const email = `testuser_${Date.now()}@example.com`;
    const password = 'password123';
    const name = 'Test User';
    
    let out = '';
    out += `Testing registration for ${email}...\n`;
    try {
        const regRes = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
        out += 'Registration success: ' + JSON.stringify(regRes.data) + '\n';
    } catch (err) {
        const errorMsg = err.code === 'ECONNREFUSED' ? 'Connection refused (server down?)' : (err.response?.data || err.message);
        out += 'Registration failed: ' + JSON.stringify(errorMsg) + '\n';
    }

    out += `\nTesting login for ${email}...\n`;
    try {
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', { email, password });
        out += 'Login success: ' + JSON.stringify(loginRes.data) + '\n';
    } catch (err) {
        const errorMsg = err.code === 'ECONNREFUSED' ? 'Connection refused (server down?)' : (err.response?.data || err.message);
        out += 'Login failed: ' + JSON.stringify(errorMsg) + '\n';
    }
    fs.writeFileSync('testAuthOutput2.txt', out);
}
testAuth();
