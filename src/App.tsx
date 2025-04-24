// App.tsx
import { AuthProvider } from "./lib/AuthProvider";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages";
import AuthScreen from "./pages/AuthScreen";
import TabsLayout from "./components/TabsLayout";
import Home from "./pages/Home";
import Create from "./pages/Create";
//import Home from "./pages";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthScreen />} />

          <Route element={<TabsLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/create" element={<Create />} />
            {/* <Route path="/profile" element={<Profile />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
