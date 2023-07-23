import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* Add the Google Maps API script tag here */}
          <script
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE}&libraries=places&callback=initMap`}
            async
            defer
          ></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
