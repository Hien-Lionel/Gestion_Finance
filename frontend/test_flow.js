import axios from 'axios';

// Get token
const login = async () => {
    const res = await axios.post('http://localhost:8000/api/auth/register/', {
        username: 'test_manager123',
        password: 'password123',
        email: 'testmanager123@example.com',
        telephone: '123456789',
        role: 'admin' // role is hardcoded in frontend so it submits to auth/register, but wait, the view checks standard.
    });
    console.log(res.data);
    const token = res.data.access;
    
    const entRes = await axios.post('http://localhost:8000/api/entreprises/', {
        nom: 'My Temp Ent',
        domaine: 'Tech',
        date_creation: null
    }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    console.log(entRes.data);
};

login().catch(console.error);
