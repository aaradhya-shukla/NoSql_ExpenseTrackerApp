
const axios = require('axios');
const form = document.getElementById('myForm');
form.addEventListener('submit',reset);
async function reset(e){
    e.preventDefault();
    console.log('here')
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    let resetObj={
        email:email,
        newPassword:password
    }
    e.preventDefault()
    try{
        const result = await axios.post('http://localhost:3000/password/Updatepassword',resetObj)
    }
    catch(err){
        console.log(err);
    }
}