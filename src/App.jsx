import { lazy, Suspense } from 'react';
import { Route, Routes } from "react-router-dom";
import useDetectTheme from "./hooks/useDetectTheme";
import Loading from './components/Loading/Loading';

// Lazy load common components
const Error = lazy(() => import("./components/Error/Error"));
const Sign = lazy(() => import("./components/Sign/sign"));

// Lazy load protected routes
const UserRoutes = lazy(() => import("./protected routes/UserRoutes"));
const AdminRoutes = lazy(() => import("./protected routes/AdminRoutes"));

// Lazy load user components
const Users = lazy(() => import("./components/Users/Users"));
const Hero = lazy(() => import("./components/Users/Hero/Hero"));
const QuizzesPage = lazy(() => import("./components/Users/QuizzesPage/QuizzesPage"));
const QuizInfo = lazy(() => import("./components/Users/QuizInfo/QuizInfo"));
const Profile = lazy(() => import("./components/Users/Profile/Profile"));
const QuizHistory = lazy(() => import("./components/Users/Profile/QuizHistory/QuizHistory"));
const UpdateUserInfo = lazy(() => import("./components/Users/Profile/UpdateUserInfo/UpdateUserInfo"));

// Components using katex with dynamic imports
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

// Lazy load admin components
const Dashboard = lazy(() => import("./components/Dashboard/Dashboard"));
const DashboardHero = lazy(() => import("./components/Dashboard/DashboardHero/DashboardHero"));
const QuizzesList = lazy(() => import("./components/Dashboard/List/QuizzesList/QuizzesList"));
const UsersList = lazy(() => import("./components/Dashboard/List/UsersList/UsersList"));
const UpdateUser = lazy(() => import("./components/Dashboard/Forms/Update/UpdateUser/UpdateUser"));
const UpdateQuiz = lazy(() => import("./components/Dashboard/Forms/Update/UpdateQuiz/UpdateQuiz"));
const CreateUser = lazy(() => import("./components/Dashboard/Forms/Create/CreateUser/CreateUser"));
const CreateQuiz = lazy(() => import("./components/Dashboard/Forms/Create/CreateQuiz/CreateQuiz"));
const ShowUser = lazy(() => import("./components/Dashboard/Show/ShowUser/ShowUser"));
const ShowUserSubmissions = lazy(() => import("./components/Dashboard/Show/ShowUser/ShowUserSubmissions/ShowUserSubmissions"));

// Katex-dependent admin components
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
    </Suspense>
  );
}

export default App;