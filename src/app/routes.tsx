import { createBrowserRouter } from "react-router";
import WelcomePage from "./components/WelcomePage";
import SignUpPage from "./components/SignUpPage";
import BankConnectionPage from "./components/BankConnectionPage";
import LoadingCompletePage from "./components/LoadingCompletePage";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import AnalysisPage from "./components/AnalysisPage";
import CharacterPage from "./components/CharacterPage";
import MissionsPage from "./components/MissionsPage";
import TierPage from "./components/TierPage";
import MissionDetailPage from "./components/MissionDetailPage";
import AppLayout from "./components/AppLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <div className="flex items-center justify-center h-screen text-gray-500">페이지를 찾을 수 없습니다</div>,
    children: [
      { index: true, Component: WelcomePage },
      { path: "signup", Component: SignUpPage },
      { path: "bank", Component: BankConnectionPage },
      { path: "loading", Component: LoadingCompletePage },
      { path: "login", Component: LoginPage },
      {
        path: "app",
        Component: AppLayout,
        children: [
          { index: true, Component: HomePage },
          { path: "analysis", Component: AnalysisPage },
          { path: "missions", Component: MissionsPage },
          { path: "character", Component: CharacterPage },
          { path: "tier", Component: TierPage },
          { path: "mission/:id", Component: MissionDetailPage },
        ],
      },
    ],
  },
]);