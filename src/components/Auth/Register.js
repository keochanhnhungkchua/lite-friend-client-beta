import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { TextField, Button, Paper } from "@material-ui/core";
import axios from "axios";
import logo from "./litefriend.png";
const useStyles = makeStyles((theme) => ({
  formLogin: {
    display: "flex",
    flexDirection: "column",
    padding: "10%",
    paddingBottom: 10,
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
    transitionDelay: "0.2s",
    "&:hover": {
      backgroundColor: "#1852f2f2",
    },
  },
}));
const schema = Yup.object().shape({
  name: Yup.string()
    .matches(/^(?!admin\b)/i, "admin is not a valid user name")
    .min(2, "Mininum 2 characters")
    .max(15, " Maximum 15 charaters")
    .required(),
  email: Yup.string().email("Invalid email format").required(),
  password: Yup.string().min(8, "Mininum 8 charaters").required(),
  confirm_password: Yup.string()
    .oneOf([Yup.ref("password")], "Password's not match")
    .required("Confirm password is require !"),
});
export default function Login() {
  const classes = useStyles();
  const [error, setError] = useState("");
  const { register, handleSubmit, errors, reset } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = async (e) => {
    setError({});
    const { data } = await axios.post(
      "https://lite-friend-server.onrender.com/api/auth/register",
      e
    );
    if (data.success) {
      window.location.href = "/login";
      reset();
    } else {
      setError(data.error);
    }
  };

  return (
    <Paper>
      <form onSubmit={handleSubmit(onSubmit)} className={classes.formLogin}>
        <img src={logo} alt="logo" />
        <TextField
          label="Enter name..."
          variant="outlined"
          type="text"
          inputRef={register}
          name="name"
          margin="normal"
          error={errors.name || error.name ? true : false ? true : false}
          helperText={
            errors.name ? errors.name.message : error.name ? error.name : ""
          }
        />
        <TextField
          label="Enter email..."
          variant="outlined"
          type="email"
          inputRef={register}
          name="email"
          margin="normal"
          error={errors.email || error.email ? true : false ? true : false}
          helperText={
            errors.email ? errors.email.message : error.email ? error.email : ""
          }
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          inputRef={register}
          name="password"
          margin="normal"
          error={errors.password ? true : false}
          helperText={errors.password ? errors.password.message : ""}
        />
        <TextField
          label="Confirm password"
          variant="outlined"
          type="password"
          inputRef={register}
          name="confirm_password"
          margin="normal"
          error={errors.confirm_password ? true : false}
          helperText={
            errors.confirm_password ? errors.confirm_password.message : ""
          }
        />
        <Button type="submit" variant="contained" className={classes.button}>
          Send
        </Button>
      </form>
      <Link className={classes.signIn} to="/login">
        If you have an account? Sign in
      </Link>
    </Paper>
  );
}
//const logo = "https://static.xx.fbcdn.net/rsrc.php/y8/r/dF5SId3UHWd.svg";

// import React from "react";

// import { makeStyles } from "@material-ui/core/styles";
// import { useForm } from "react-hook-form";
// import { Link } from "react-router-dom";
// // import axios from "axios";

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
//     console.log(e);
//   };
//   const logo = "https://static.xx.fbcdn.net/rsrc.php/y8/r/dF5SId3UHWd.svg";
//   return (
//     <div>
//       <img src={logo} alt="logo" />
//       <form onSubmit={handleSubmit(onSubmit)} className={classes.formLogin}>
//         <label htmlFor="name">Name</label>
//         <input
//           type="text"
//           name="name"
//           id="name"
//           placeholder="Enter name..."
//           ref={register({ required: true })}
//           className={classes.formInput}
//         />
//         {errors.email && <span>This field is required</span>}
//         <label htmlFor="email">Email</label>
//         <input
//           type="email"
//           name="email"
//           id="email"
//           placeholder="Enter email ..."
//           ref={register({ required: true })}
//           className={classes.formInput}
//         />
//         {errors.email && <span>This field is required</span>}
//         <label htmlFor="password">Password</label>
//         <input
//           type="password"
//           name="password"
//           id="password"
//           placeholder="Enter password ..."
//           ref={register({ required: true })}
//           className={classes.formInput}
//         />
//         {errors.password && <span>This field is required</span>}
//         <input
//           type="password"
//           name="password2"
//           id="password2"
//           placeholder="Confirm password ..."
//           ref={register({ required: true })}
//           className={classes.formInput}
//         />
//         {errors.password && <span>This field is required</span>}
//         <input className={classes.formLoginButton} type="submit" value="Send" />
//       </form>
//       <div className={classes.signUp}>
//         <Link to="/login">If you have an account? Sign in</Link>
//       </div>
//     </div>
//   );
// }
