import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./store/store.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ErrorBoundary from "./ErrorBoundery.tsx";
import { SnackbarProvider } from "notistack";
import RefreshToken from "./RefreshToken.tsx";
import ServiceUnavailable from "./pages/ServiceUnavailable.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary fallback={<ServiceUnavailable />}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <SnackbarProvider autoHideDuration={3000}>
              <RefreshToken>
                <App />
              </RefreshToken>
            </SnackbarProvider>
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  </StrictMode>,
);
