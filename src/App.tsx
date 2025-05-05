// App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/AuthProvider";

import Index from "./pages";
import AuthScreen from "./pages/AuthScreen";
import TabsLayout from "./components/TabsLayout";
import Home from "./pages/Home";
import Create from "./pages/Create";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthScreen />} />

          <Route
            element={
              <ProtectedRoute>
                <TabsLayout />
              </ProtectedRoute>
            }>
            <Route path="/home" element={<Home />} />
            <Route path="/create" element={<Create />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
