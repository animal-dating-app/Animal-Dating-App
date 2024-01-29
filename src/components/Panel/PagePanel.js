import React from 'react';

const PagePanel = () => {
  return (
    <div className="page-panel">
      {/* panel content */}
      <h1 className='title'>Discover a Friend, Change a Life.</h1>
      <style jsx>{`
        :root{
          --brand-02: #F4CFC6;
          --text-01: #45413E;
          -webkit-font-smoothing: antialiased;
          font-smoothing: antialiased;
          scroll-behavior: smooth;
        }
        .page-panel {
          width: 100%;
          height: 350px;
          background: var(--brand-02) url('https://ouch-cdn2.icons8.com/hxxz5Qr551KY1597yq-mz9zWRTkAT-cob5eZ8UreBBo/rs:fit:368:338/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9wbmcvNzcy/L2UxYjU4YWUwLTc3/YjQtNGQ1OC05NjJl/LWUzODQ1Y2IyYzBi/Ny5wbmc.png') no-repeat center right;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          grid-gap: 48px;
          display: inline-flex;
        }

        .title {
          font-size: 40px;
          font-weight: 600;
          line-height: 1.2;
          width: 100%;
          color: var(--text-01);
        }

        /* Media Queries for responsiveness */
        @media only screen and (max-width: 768px) {
          .page-panel {
            height: auto;
            padding: 20px; /* Add padding for smaller screens */
            align-items: center;
            text-align: center;
          }

          .title {
            font-size: 32px;
          }
        }

        @media only screen and (max-width: 480px) {
          .title {
            font-size: 28px;
          }
        }
      `}</style>
    </div>
  );
};

export default PagePanel;
