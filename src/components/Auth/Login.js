import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { TextField, Button, Paper } from '@material-ui/core';
import axios from "axios";
import logo from "./litefriend.png"
const useStyles = makeStyles((theme) => ({
  formLogin: {
    display: "flex",
    flexDirection: "column",
    padding: "10%",
    paddingBottom: 10
  },
  formInput: {
    margin: "5px 0px",
    marginLeft: 0,
    padding: 15,
  },
  signIn: {
    display: "flex",
    flexDirection: "column",
    padding: "10%",
    paddingTop: 0,
  },
  button: {
    marginTop: 10,
    backgroundColor: " #1877f2",
    fontWeight: "bold",
    color: "white",
    transitionDelay: '0.2s',
    "&:hover": {
      backgroundColor: "#1852f2f2",
    },
  }
}));
const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required(),
  password: Yup.string()
    .min(8, "Mininum 8 charaters")
    .required(),
})
export default function Login() {
  const classes = useStyles();
  const [error, setError] = useState("")
  const { register, handleSubmit, errors, reset } = useForm({
    resolver: yupResolver(schema)
  });
  const onSubmit = async (e) => {
    setError("")
    try {
      const { data } = await axios.post("https://lite-friend.herokuapp.com/api/auth/login", e)

      if (data.success) {
        localStorage.setItem("lite-friend", data.token)
        window.location.href = "/";
        reset();
      } else {
        setError(data.error)
      }
    } catch (errors) {
      console.log(errors);
    }

  };

  return (
    <Paper>
      <form onSubmit={handleSubmit(onSubmit)} className={classes.formLogin}>
        <img src={logo} alt="logo" />
        <TextField
          label="Enter email"
          variant="outlined"
          type="email"
          inputRef={register}
          name="email"
          margin="normal"
          error={errors.email || error ? true : false ? true : false}
          helperText={errors.email ? errors.email.message : ""}
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          inputRef={register}
          name="password"
          margin="normal"
          error={errors.password || error ? true : false ? true : false}
          helperText={errors.password ? errors.password.message : error}
        />
        <Button type="submit"
          variant="contained"
          className={classes.button}
        >
          Send
         </Button>
      </form>
      <div className={classes.signIn}>
        <Link to="/register">Don't have an account? Sign up</Link>
        <Link to="/forgot-password"> Forgot password?</Link>
      </div>
    </Paper>
  );
}



// import React from "react";

// import { makeStyles } from "@material-ui/core/styles";
// import { useForm } from "react-hook-form";
// import { Link } from "react-router-dom";
// import axios from "axios";

// import setAuthHeader from "../Data/setAuthHeader";

// const useStyles = makeStyles((theme) => ({
//   formLogin: {
//     display: "flex",
//     flexDirection: "column",
//     padding: "10%",
//   },
//   formInput: {
//     margin: "5 0",
//     marginLeft: 0,
//     padding: 15,
//   },
//   formLoginButton: {
//     marginTop: 10,
//     background: "#1877f2",
//     border: "none",
//     borderRadius: 2,
//     height: 30,
//     fontWeight: "bold",
//     color: "white",
//   },
//   signUp: {
//     display: "flex",
//     flexDirection: "column",
//     padding: "10%",
//     paddingTop: 0,
//   },
// }));

// export default function Login() {
//   const classes = useStyles();
//   const { register, handleSubmit, errors } = useForm();
//   const onSubmit = async (e) => {
//     const { data } = await axios.post(
//       "https://lite-friend.herokuapp.com/api/auth/login",
//       e
//     );
//     localStorage.setItem("lite-friend", data.token);
//     setAuthHeader(data.token);
//     window.location.href = "/";
//   };
//   const logo = "https://static.xx.fbcdn.net/rsrc.php/y8/r/dF5SId3UHWd.svg";
//   return (
//     <div>
//       <img src={logo} alt="logo" />
//       <form onSubmit={handleSubmit(onSubmit)} className={classes.formLogin}>
//         <label htmlFor="email">Email</label>
//         <input
//           type="email"
//           name="email"
//           id="email"
//           placeholder="Enter email..."
//           ref={register({ required: true })}
//           className={classes.formInput}
//         />
//         {errors.email && <span>This field is required</span>}
//         <label htmlFor="password">Password</label>
//         <input
//           type="password"
//           name="password"
//           id="password"
//           placeholder="Enter password..."
//           ref={register({ required: true })}
//           className={classes.formInput}
//         />
//         {errors.password && <span>This field is required</span>}
//         <input
//           className={classes.formLoginButton}
//           type="submit"
//           value="Login"
//         />
//       </form>
//       <div className={classes.signUp}>
//         <Link to="/register">Don't have an account? Sign Up</Link>
//         <Link to="/forgotpassword"> Forgot password?</Link>
//       </div>
//     </div>
//   );
// }
