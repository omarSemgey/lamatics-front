import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import useDetectTheme from "./hooks/useDetectTheme";
import Loading from './components/Loading/Loading';

// User core 

import Users from "./components/Users/Users";
import Hero from "./components/Users/Hero/Hero";
import QuizzesPage from "./components/Users/QuizzesPage/QuizzesPage";
import QuizInfo from "./components/Users/QuizInfo/QuizInfo";
import Profile from "./components/Users/Profile/Profile";

// Route guards
import UserRoutes from "./protected routes/UserRoutes";
import AdminRoutes from "./protected routes/AdminRoutes";

// Admin core
import Dashboard from "./components/Dashboard/Dashboard";
import DashboardHero from "./components/Dashboard/DashboardHero/DashboardHero";
import QuizzesList from "./components/Dashboard/List/QuizzesList/QuizzesList";
import UsersList from "./components/Dashboard/List/UsersList/UsersList";
import CreateUser from "./components/Dashboard/Forms/Create/CreateUser/CreateUser";
import UpdateUser from "./components/Dashboard/Forms/Update/UpdateUser/UpdateUser";

// Lazy load rarely visited main components
const Error = lazy(() => import("./components/Error/Error"));
const Sign = lazy(() => import("./components/Sign/sign"));

// Lazy load  rarely visited user components
const QuizHistory = lazy(() => import("./components/Users/Profile/QuizHistory/QuizHistory"));
const UpdateUserInfo = lazy(() => import("./components/Users/Profile/UpdateUserInfo/UpdateUserInfo"));

// Lazy load heavy  user components
const QuizSession = lazy(() => 
  Promise.all([
    import("./components/Users/QuizSession/QuizSession"),
    import("katex")
  ]).then(([module]) => module)
);

const QuizResults = lazy(() => 
  Promise.all([
    import("./components/Users/QuizResults/QuizResults"),
    import("katex")
  ]).then(([module]) => module)
);

// Lazy load rarely visited admin components
const ShowUser = lazy(() => import("./components/Dashboard/Show/ShowUser/ShowUser"))
const ShowUserSubmissions = lazy(() => import("./components/Dashboard/Show/ShowUser/ShowUserSubmissions/ShowUserSubmissions"));

// Lazy load heavy admin components

const CreateQuiz = lazy(() => 
  Promise.all([
    import("./components/Dashboard/Forms/Create/CreateQuiz/CreateQuiz"),
    import("katex")
  ]).then(([module]) => module)
);

const UpdateQuiz = lazy(() => 
  Promise.all([
    import("./components/Dashboard/Forms/Update/UpdateQuiz/UpdateQuiz"),
    import("katex")
  ]).then(([module]) => module)
);

const ShowQuiz = lazy(() => 
  Promise.all([
    import("./components/Dashboard/Show/ShowQuiz/ShowQuiz"),
    import("katex")
  ]).then(([module]) => module)
);

const ShowUserResults = lazy(() => 
  Promise.all([
    import("./components/Dashboard/Show/ShowUser/ShowUserResults/ShowUserResults"),
    import("katex")
  ]).then(([module]) => module)
);

function App() {
  useDetectTheme();

  return (
    <Suspense fallback={<Loading />}>
      {/* <Router> */}
        <Routes>
          <Route path="*" element={<Error />} />
          <Route path="/login" element={<Sign mode="login" />} />
          <Route path="/signup" element={<Sign mode="signup" />} />

          {/* User routes */}
          <Route element={<UserRoutes />}>
            <Route path="/" element={<Users />}>
              <Route index element={<Hero />} />
              <Route path="/quizzes" element={<QuizzesPage mode="list" />} />
              <Route path="/quizzes/page/:page" element={<QuizzesPage mode="list" />} />
              <Route path="/quizzes/search/:search" element={<QuizzesPage mode="search" />} />
              <Route path="/quizzes/search/:search/page/:page" element={<QuizzesPage mode="search" />} />
              <Route path="/quizzes/show/:quiz" element={<QuizInfo />} />
              <Route path="/quizzes/quizSession/:quiz" element={<QuizSession />} />
              <Route path="/quizzes/results/:quiz" element={<QuizResults />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/update" element={<UpdateUserInfo />} />
              <Route path="/profile/history" element={<QuizHistory mode="list" />} />
              <Route path="/profile/history/page/:page" element={<QuizHistory mode="list" />} />
              <Route path="/profile/history/search/:search" element={<QuizHistory mode="search" />} />
              <Route path="/profile/history/search/:search/page/:page" element={<QuizHistory mode="search" />} />
            </Route>
          </Route>

          {/* Admin routes */}
          <Route element={<AdminRoutes />}>
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<DashboardHero />} />
              <Route path="/dashboard/quizzes" element={<QuizzesList mode="list" />} />
              <Route path="/dashboard/quizzes/page/:page" element={<QuizzesList mode="list" />} />
              <Route path="/dashboard/quizzes/search/:search" element={<QuizzesList mode="search" />} />
              <Route path="/dashboard/quizzes/search/:search/page/:page" element={<QuizzesList mode="search" />} />
              <Route path="/dashboard/quizzes/show/:quiz" element={<ShowQuiz />} />
              <Route path="/dashboard/quizzes/create" element={<CreateQuiz />} />
              <Route path="/dashboard/quizzes/update/:quiz" element={<UpdateQuiz />} />
              <Route path="/dashboard/users" element={<UsersList mode="list" />} />
              <Route path="/dashboard/users/page/:page" element={<UsersList mode="list" />} />
              <Route path="/dashboard/users/search/:search" element={<UsersList mode="search" />} />
              <Route path="/dashboard/users/search/:search/page/:page" element={<UsersList mode="search" />} />
              <Route path="/dashboard/users/show/:user" element={<ShowUser />} />
              <Route path="/dashboard/users/:user/submissions" element={<ShowUserSubmissions mode="list" />} />
              <Route path="/dashboard/users/:user/submissions/page/:page" element={<ShowUserSubmissions mode="list" />} />
              <Route path="/dashboard/users/:user/submissions/search/:search" element={<ShowUserSubmissions mode="search" />} />
              <Route path="/dashboard/users/:user/submissions/search/:search/page/:page" element={<ShowUserSubmissions mode="search" />} />
              <Route path="/dashboard/users/:user/results/:quiz" element={<ShowUserResults />} />
              <Route path="/dashboard/users/create" element={<CreateUser />} />
              <Route path="/dashboard/users/update/:user" element={<UpdateUser />} />
            </Route>
          </Route>
        </Routes>
      {/* </Router> */}
    </Suspense>
  );
}

export default App;