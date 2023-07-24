import { AuthProvider } from "../context/AuthProvider";
import { DataProvider } from "../context/DataProvider";
import Layout from "../components/Layout";
import Protected from "../components/Protected";
import { ToastContainer } from "react-toastify";
import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import NextNProgress from 'nextjs-progressbar';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  return (
    <>
      <AuthProvider>
        <Protected>
          <DataProvider>
            <Layout>
            <NextNProgress color="#d09a00" height={4} />
              <Component {...pageProps} />
            </Layout>
          </DataProvider>
        </Protected>
      </AuthProvider>
      <ToastContainer theme="dark" />
    </>
  );
}

export default MyApp;
