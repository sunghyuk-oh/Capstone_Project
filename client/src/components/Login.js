import { useState } from 'react'
import { connect } from 'react-redux'

function Login(props) {
    const [userLogin, setUserLogin] = useState({})
    const [userRegister, setUserRegister] = useState({})
    const [loginSuccess, setLoginSuccess] = useState({success: true, message: ''})
    const [registerSuccess, setRegisterSuccess] = useState({success: false, message: ''})
    const [registerFail, setRegisterFail] = useState({fail: false, message: ''})


    const handleLoginInput = (e) => {
        setUserLogin({
            ...userLogin,
            [e.target.name]: e.target.value
        })
    }


    const handleRegisterInput = (e) => {
        setUserRegister({
            ...userRegister,
            [e.target.name]: e.target.value
        })
    }


    const handleLogin = () => {
        fetch('http://localhost:8080/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userLogin)
        })
          .then((response) => response.json())
          .then((result) => {
            if (result.success) {
              localStorage.setItem('userToken', result.token);
              localStorage.setItem('username', result.username);
              localStorage.setItem('userID', result.userID);
              props.onLogin();
              props.history.push('/');
            } else {
              setLoginSuccess({ success: false, message: result.message });
              console.log('Login Failed');
            }
          })
          .catch((err) => console.log(err));
    
        setUserLogin({});
      };


    const handleRegister = () => {
        fetch('http://localhost:8080/register', {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(userRegister)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                setRegisterSuccess({success: true, message: result.message})
                
                if (registerFail) {
                    setRegisterFail({fail: false, message: ''})
                }

                props.history.push('/login')
            } else {
                setRegisterFail({fail: true, message: result.message})
            }
        })
        .catch(err => console.log(err))
    }


    return (
        <section className="">
            <div className="">
                <h3>Login</h3>
                {!loginSuccess.success ? <p>{loginSuccess.message}</p> : null}
                <input type="text" onChange={handleLoginInput} name="username" placeholder="Username"/>
                <input type="password" onChange={handleLoginInput} name="password" placeholder="Password"/>
                <button onClick={handleLogin}>Login</button>
            </div>
            <div className="">
                <h3>Sign Up</h3>
                {registerSuccess.success ? <p>{registerSuccess.message}</p> : null}
                {registerFail.fail ? <p>{registerFail.message}</p> : null}
                <input type="text" onChange={handleRegisterInput} name="firstName" placeholder="First Name"/>
                <input type="text" onChange={handleRegisterInput} name="lastName" placeholder="Last Name"/>
                <input type="text" onChange={handleRegisterInput} name="email" placeholder="Email"/>
                <input type="text" onChange={handleRegisterInput} name="username" placeholder="Username"/>
                <input type="password" onChange={handleRegisterInput} name="password" placeholder="Password"/>
                <input type="password" onChange={handleRegisterInput} name="confirmPassword" placeholder="Confirm Password"/>
                <button onClick={handleRegister}>Register</button>
            </div>
        </section>
    )
}


const mapDispatchToProps = (dispatch) => {
    return {
        onLogin: () => dispatch({type: "ON_LOGIN"})
    }
}

export default connect(null, mapDispatchToProps)(Login)