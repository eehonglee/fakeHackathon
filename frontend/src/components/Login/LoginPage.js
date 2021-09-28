import React, { useReducer, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

const emailReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    //add all validation here , only if true then isValid return true
    return { value: action.val, isValid: action.val.includes("@") };
  }
  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.includes("@") };
  }
  return { value: "", isValid: false };
};

const passwordReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.trim().length > 6 };
  }
  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.trim().length > 6 };
  }
  return { value: "", isValid: false };
};

function LoginPage(props) {
  const history = useHistory();

  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: null,
  });
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: null,
  });

  const { isValid: emailIsValid } = emailState; //extract out isValid from emailState and pwState
  const { isValid: passwordIsValid } = passwordState;

  useEffect(() => {
    console.log("Checking form validity!");
    setFormIsValid(emailIsValid && passwordIsValid);
  }, [emailIsValid, passwordIsValid]);

  const emailHandler = (event) => {
    dispatchEmail({ type: "USER_INPUT", val: event.target.value });
  };

  const passwordHandler = (event) => {
    dispatchPassword({ type: "USER_INPUT", val: event.target.value });
  };

  const validateEmailHandler = () => {
    dispatchEmail({ type: "INPUT_BLUR" });
    console.log(emailState);
  };

  const validatePasswordHandler = () => {
    dispatchPassword({ type: "INPUT_BLUR" });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    console.log(formIsValid);
    if (formIsValid) {
      const enteredEmail = emailState.value;
      const enteredPassword = passwordState.value;

      const url = "http://localhost:3001/api/login";

      fetch(url, {
        method: "POST",
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
        }),
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:3001",
          "Content-Type": "application/json",
        },
      }).then(async (res) => {
        const data = await res.json();
        console.log(data);
      });
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <div>
        <label htmlFor="email">Your Email</label>
        <input
          type="email"
          id="email"
          onChange={emailHandler}
          onBlur={validateEmailHandler}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Your Password</label>
        <input
          type="password"
          id="password"
          onChange={passwordHandler}
          onBlur={validatePasswordHandler}
          required
        />
      </div>
      <div>
        <button>Login</button>
      </div>
    </form>
  );
}

export default LoginPage;
