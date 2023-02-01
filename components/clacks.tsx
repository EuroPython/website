// https://xclacksoverhead.org/home/about
// we're using `dangerouslySetInnerHTML` here because nor Next.js nor React support
// html comments in JSX, and we want to keep the In remembrance section in the
// output of the page

export const Clacks = () => {
  return (
    <head
      dangerouslySetInnerHTML={{
        __html: `
      <!-- In remembrance -->
      <meta httpEquiv="X-Clacks-Overhead" content="GNU John Pinner" />
      <meta httpEquiv="X-Clacks-Overhead" content="GNU Rob Collins" />
      <meta httpEquiv="X-Clacks-Overhead" content="GNU Oier Etxaniz" />
    `,
      }}
    ></head>
  );
};
