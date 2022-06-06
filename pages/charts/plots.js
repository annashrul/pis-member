import Head from 'next/head';

import Plot from '../../demos/vis/showcase-sections/plots-showcase';

const PlotPage = () => (
  <>
    <Head>
      <link rel="stylesheet" href="/react-vis.css" />
    </Head>
    <Plot />
  </>
);

export default PlotPage;
