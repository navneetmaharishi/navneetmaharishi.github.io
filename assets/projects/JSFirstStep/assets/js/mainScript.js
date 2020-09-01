function userSuggestion(value) {

    let printValue;

    if (value === 'zero') {
        printValue = 'Name should be in between 3-32 letters Which includes only Alphabets'
    } else if (value === 'one') {
        printValue = 'Age should be in between 18-100';
    } else if (value === 'two') {
        printValue = 'Enter your valid E-mail id';
    } else if (value === 'three') {
        printValue = 'Password should contain digit and special character minimum length is 8 and maximum length is 16 which includes at least one Capital letter,digit and special character.';
    } else if (value === 'four') {
        printValue = 'please enter your address which should be in 6-500 letters';
    }

    let p = document.createElement('p');
    let myValue = document.createTextNode(`${printValue}`);
    p.appendChild(myValue);
    document.querySelector('.suggestionsBox').appendChild(p);
    document.querySelector('.suggestionsBox').style.display = 'inline-block';
}

function suggestionsLeave() {
    let onLeave = document.querySelector('.suggestionsBox p');
    onLeave.remove();
    document.querySelector('.suggestionsBox').style.display = 'none';
}


// name validator
function validateName() {
    console.log('validateName called');
    let name = document.getElementsByClassName('usr')[0];
    let error = name.parentElement.getElementsByClassName('error')[0];
    let testName = /[^0-9][^`~!@#$%^&*:;"'|]{2,33}/g.test(name.value);

    if (testName) {
        error.innerHTML = '';
        return true;
    } else {
        error.innerHTML = 'Name is invalid';
        return false;
    }

    
}

// age validator
function validateAge() {
    let age = document.getElementsByClassName('age')[0];
    let error = age.parentElement.getElementsByClassName('error')[0];
    let testAge = age.value > 17 && age.value < 101;

    if (testAge) {
        error.innerHTML = '';
        return true;
    } else {
        error.innerHTML = 'Age is invalid';
        return false;
    }
}

// email validator
function validateEmail() {
    let email = document.getElementsByClassName('email')[0];
    let error = email.parentElement.getElementsByClassName('error')[0];
    let testEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email.value);
    if (testEmail) {
        error.innerHTML = '';
        return true;
    } else {
        error.innerHTML = 'Email is invalid';
        return false;
    }function placeholder(){
        let x =  document.getElementById("myText").placeholder = 'name';
        
       
       }
}

// password validator
function validatePass() {
    let pass = document.getElementsByClassName('pass')[0];
    let error = pass.parentElement.getElementsByClassName('error')[0];
    let testPass = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(pass.value);
    if (testPass) {
        error.innerHTML = '';
        return true;
    } else {
        error.innerHTML = 'password is invalid';
        return false;
    }
}

// address validator
function validAddress() {
    let address = document.getElementsByClassName('address')[0];
    let addressVal = address.value;
    let error = address.parentElement.getElementsByClassName('error')[0];
    let testAddress = addressVal.length > 5 && addressVal.length < 501;

    if (testAddress) {
        error.innerHTML = '';
        return true;
    } else {
        error.innerHTML = 'Address is invalid';
    }
}

// submit function
function submit(e) {
    e.preventDefault();
    let name, age, email, address;
    name = document.querySelector('.usr').value;
    age = document.querySelector('.age').value;
    email = document.querySelector('.email').value;
    address = document.querySelector('.address').value;

    if (validateName() & validateAge() & validatePass() & validateEmail() & validAddress()) {
        document.querySelector('#data-table').style.display='table';
        document.querySelector('#data-table').innerHTML += `
            <tr>
                <td>${name}</td>
                <td>${age}</td>
                <td>${email}</td>
                <td>${address}</td>
            </tr>
        `;

        document.querySelector('.usr').value="";
        document.querySelector('.age').value="";
        document.querySelector('.email').value="";
        document.querySelector('.pass').value="";
        document.querySelector('.address').value="";

    }
}

function placeHolder(e){
    e.parentElement.getElementsByClassName('place-holder')[0].classList.add('set-position');  
}