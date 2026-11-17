import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { DashboardPage } from "../features/dashboard/DashboardPage";
import { ProblemsPage } from "../features/problems/ProblemsPage";
import { TopicsPage } from "../features/problems/TopicsPage";
import { ProblemPage } from "../features/problems/ProblemPage";
import { VisualizerPage } from "../features/visualizer/VisualizerPage";
import { VisualizerGuidePage } from "../features/visualizer/VisualizerGuidePage";
import { BookmarksPage } from "../features/bookmarks/BookmarksPage";
import { SettingsPage } from "../features/settings/SettingsPage";
import { PracticePage } from "../features/practice/PracticePage";
import { TimedPage } from "../features/practice/TimedPage";
import { ConceptsPage } from "../features/cheatsheet/ConceptsPage";
import { ConceptsPracticePage } from '../features/concepts-practice/ConceptsPracticePage';
import { AnalyticsPage } from "../features/progress/AnalyticsPage";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <DashboardPage /> },
      { path: "/problems", element: <ProblemsPage /> },
      { path: "/concepts", element: <ConceptsPage /> },
      { path: '/concepts/practice', element: <ConceptsPracticePage /> },
      { path: "/visualizer-guide", element: <VisualizerGuidePage /> },
      { path: "/problem/:id/visualize", element: <VisualizerPage /> },
      { path: "/problem/:id", element: <ProblemPage /> },
      { path: "/topics", element: <TopicsPage /> },
      { path: "/practice", element: <PracticePage /> },
      { path: "/timed", element: <TimedPage /> },
      { path: "/bookmarks", element: <BookmarksPage /> },
      { path: "/analytics", element: <AnalyticsPage /> },
      { path: "/settings", element: <SettingsPage /> },
    ],
  },
]);
