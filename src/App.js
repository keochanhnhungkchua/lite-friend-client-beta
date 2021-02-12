import React, { Suspense, useEffect } from "react";
import jwt from "jsonwebtoken";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ForgotPassword from "./components/Auth/ForgotPassword";
import setAuthHeader from "./components/Data/setAuthHeader";
import ProfileRender from "./components/Pages/ProfileRender";
import PostId from "./components/Pages/PostId";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import Home from "./components/Pages/Home"
import ChatApp from "./components/Socketio/ChatApp";
import { GoHomeIfLogged,GologinIfNotLogin } from "./routes"

export default function App() {
  const token = localStorage.getItem("lite-friend");
  const isAuthenticated = token !== null ? true : false;
  if (token) {
    const currentTime = Date.now() / 1000;
    const decoded = jwt.decode(token, { complete: true });
    if (currentTime > decoded.exp) {
      localStorage.removeItem("lite-friend");

    } else {
      setAuthHeader(token)
    }
  }
  return (
    <Router>
      <Switch>
        <GoHomeIfLogged exact path="/login" component={Login} />
        <GoHomeIfLogged exact path="/register" component={Register} />
        <GoHomeIfLogged exact path="/forgot-password" component={ForgotPassword} />
  
        <GologinIfNotLogin exact path="/" component={Home} />
        <GologinIfNotLogin exact path="/profile/:userId" component={ProfileRender} />
      </Switch>   
    </Router>
  )


}


// export default function App() {
//   const isLoading  = useRecoilValueLoadable(isMeRecoil).state === "loading" ? false :true;

//   return (
//     isLoading &&(
//     <Router>
//       <Switch>
//         <Route exact path="/login" component={Login} />
//         <Route exact path="/register" component={Register} />
//         <Route exact path="/forgotpassword" component={ForgotPassword} />
//         <Route exact path="/post/:postId" component={PostId} />
//         <Route exact path="/Render/:userId">
//           <Suspense fallback={<h3>loading data...</h3>}>
//             <Profile />
//           </Suspense>
//         </Route>
//         <Route exact path="/">
//           <Suspense fallback={<h3>loading data...</h3>}>
//             <Header />
//             <Footer />
//           </Suspense>
//         </Route>
//       </Switch>
//     </Router>
//     )

//   );
// }
