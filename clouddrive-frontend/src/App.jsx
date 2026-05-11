import { Navigate, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import PreviewPage from "./pages/PreviewPage";
import ProjectAlphaPage from "./pages/ProjectAlphaPage";
import RecentPage from "./pages/RecentPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import SharedPage from "./pages/SharedPage";
import ShareFilePage from "./pages/ShareFilePage";
import SignupPage from "./pages/SignupPage";
import StarredPage from "./pages/StarredPage";
import TrashPage from "./pages/TrashPage";
import UploadPage from "./pages/UploadPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />
      <Route path="/upload" element={
        <ProtectedRoute>
          <UploadPage />
        </ProtectedRoute>
      } />
      <Route path="/search" element={
        <ProtectedRoute>
          <RecentPage />
        </ProtectedRoute>
      } />
      <Route path="/search-results" element={
        <ProtectedRoute>
          <SearchResultsPage />
        </ProtectedRoute>
      } />
      <Route path="/trash" element={
        <ProtectedRoute>
          <TrashPage />
        </ProtectedRoute>
      } />
      <Route path="/share" element={
        <ProtectedRoute>
          <SharedPage />
        </ProtectedRoute>
      } />
      <Route path="/preview" element={
        <ProtectedRoute>
          <PreviewPage />
        </ProtectedRoute>
      } />
      <Route path="/project-alpha" element={
        <ProtectedRoute>
          <ProjectAlphaPage />
        </ProtectedRoute>
      } />
      <Route path="/starred" element={
        <ProtectedRoute>
          <StarredPage />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
