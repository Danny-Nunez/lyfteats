import Head from "next/head";

const Meta = ({ title, keywords, description }) => {
  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="keywords" content={keywords} />
      <meta name="description" content={description} />
      <title>{title}</title>
    </Head>
  );
};

Meta.defaultProps = {
  title: "lyfteats.vercel.app",
  keywords: "restaurant, order, web application, NextJs App, customer order",
  description: "Lyfeats, where small restaurants grow, and generate community",
};

export default Meta;
