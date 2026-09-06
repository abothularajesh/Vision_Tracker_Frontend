import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import AuthForm from "./AuthForm.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Roadmap from "./pages/Roadmap/Roadmap.jsx";
import Goals from "./pages/Goals/Goals.jsx";
import TodoList from "./pages/ToDoList/TodoList.jsx";
import Progress from "./pages/Progress/Progress.jsx";
import OAuth2Success from "./OAuth2Sucess.jsx";
import Notebook from "./pages/Notebook/Notebook.jsx";
import Settings from "./pages/Settings/Settings.jsx";
import Assistant from "./pages/Assistant/Assistant.jsx";

function App() {

    return (
        <BrowserRouter>

            <Routes>

                {/* Default route */}
                <Route
                    path="/"
                    element={<Navigate to="/login" replace />}
                />

                {/* Public route */}
                <Route
                    path="/login"
                    element={<AuthForm />}
                />

                {/* OAuth2 */}
                <Route
                    path="/oauth2/success"
                    element={<OAuth2Success />}
                />

                {/* Protected routes */}

                <Route element={<ProtectedRoute />}>

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/goals"
                        element={<Goals />}
                    />

                    <Route
                        path="/roadmap/:goalId"
                        element={<Roadmap />}
                    />

                    <Route
                        path="/tasks"
                        element={<TodoList />}
                    />

                    <Route
                        path="/progress"
                        element={<Progress />}
                    />

                    <Route
                        path="/notebook"
                        element={<Notebook />}
                    />

                    <Route
                        path="/settings"
                        element={<Settings />}
                    />

                    <Route
                        path="/assistant"
                        element={<Assistant />}
                    />

                </Route>

            </Routes>

        </BrowserRouter>
    );
}

export default App;

