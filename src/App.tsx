import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./components/AuthProvider";

function App() {
  const queryClient = new QueryClient({});
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Toaster
          toastOptions={{
            error: { style: { color: "white", background: "#2e3741" } },
            position: "top-right",
          }}
        />
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}

export default App;
