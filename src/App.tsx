import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { AuthProvider } from "./components/AuthProvider";

function App() {
  const queryClient = new QueryClient({});
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router}></RouterProvider>
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
