import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { SiteHeader } from "./components/header"; // Adjust this path to where your header is
import Home from "./pages/home";
import { ROUTES } from "@/lib/routes";
import { SpeedInsights } from "@vercel/speed-insights/next"

// 1. The Layout: Header stays at the top, the <Outlet> renders the page content below
function RootLayout() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <SpeedInsights/>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

// 2. Placeholder Pages (We will build these out later)

const Docs = () => (
  <div className="p-8 text-center text-2xl">📚 Documentation Page</div>
);

// 3. Map the URLs to the Pages
const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> }, // Loads on "/"
      { path: "docs", element: <Docs /> }, // Loads on "/docs"
    ],
  },
]);

// 4. Render the App
export default function App() {
  return <RouterProvider router={router} />;
}
