/* eslint-disable react/jsx-props-no-spreading, react/prop-types */
export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
