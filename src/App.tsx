import Layout from "./Layout";
import { ThemeProvider } from "@/components/theme-provider";
import Home from "@/pages/Home";
import { SignIn, SignUp } from "@/pages/Auth";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import PublicShare from "./pages/PublicShare";
import Chat from "./pages/Chat";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/signin" replace />;
  return <>{children}</>;
};

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Home />} />
              <Route path="/:type" element={<Home />} />
              <Route path="chat" element={<Chat />} />
            </Route>

            <Route path="/brain/share/:id" element={<PublicShare />} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  );
};

export default App;
