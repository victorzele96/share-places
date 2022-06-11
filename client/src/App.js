import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

//? User
import Navbar from "./shared/components/Navigation/Navbar";
import AllPlaces from "./place/pages/AllPlaces";
//?

import { CircularProgress } from "@mui/material";

import { AuthContext } from "./shared/context/auth-context";

import { useAuth } from "./shared/hooks/auth-hook";

import { CssBaseline } from "@mui/material";

//? User
const Favorites = lazy(() => import("./place/pages/Favorites"));
const NewPlace = lazy(() => import("./place/pages/NewPlace"));
const EditPlace = lazy(() => import("./place/pages/EditPlace"));
const MyPlaces = lazy(() => import("./place/pages/MyPlaces"));
const ShowPlace = lazy(() => import("./place/pages/ShowPlace"));
const Auth = lazy(() => import("./users/pages/Auth"));

const App = () => {
  const { token, signin, signout, user } = useAuth();

  const userRoutes = (
    <>
      <Routes>
        {/* User routes */}
        <Route exact path={"/"} element={<AllPlaces tagId="main-content" />} />
        <Route exact path={"/auth"} element={<Auth tagId="main-content" />} />
        {user && (
          <>
            <Route
              exact
              path={"/favorites"}
              element={<Favorites tagId="main-content" />}
            />
            <Route
              exact
              path={"/add-place"}
              element={<NewPlace tagId="main-content" />}
            />
            <Route
              exact
              path={"/my-places"}
              element={<MyPlaces tagId="main-content" />}
            />
            <Route
              exact
              path={"/edit-place/:pid"}
              element={<EditPlace tagId="main-content" />}
            />
          </>
        )}
        <Route
          exact
          path={"/place/:placeId"}
          element={<ShowPlace tagId="main-content" />}
        />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </>
  );

  return (
    <AuthContext.Provider
      value={{
        isSignedIn: !!token,
        token,
        signin,
        signout,
        user,
      }}
    >
      <div className="root">
        <CssBaseline />
        <Navbar />
        <Suspense fallback={<CircularProgress />}>{userRoutes}</Suspense>
      </div>
    </AuthContext.Provider>
  );
};

export default App;
