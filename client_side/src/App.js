import "./App.css";
import React from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import {Campaigns} from "./pages/Campaigns/Campaigns.jsx";
import  CampaignPreview  from "./pages/CampaignPreview/CampaignPreview.jsx";

function App() {
  const queryClient = new QueryClient();

  const Layout = () => {
    return (
      <div className="app">
        <QueryClientProvider client={queryClient}>
          <Outlet />
        </QueryClientProvider>
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Campaigns />,
        },
        {
          path: "/preview/:id",
          element: <CampaignPreview />,
        },
      ],
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
