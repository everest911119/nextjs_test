import '../styles/globals.css';
import type { AppContext, AppProps } from 'next/app';
import Layout from 'components/layout';
import { StoreProvider } from 'store/index';
// import request from 'service/fetch';
// import App from 'next/app';
import { getIronSession } from 'iron-session';
import { ironOptions } from 'config';
import App from 'next/app';
import { ISession } from './api';
import { initialProps } from 'store/rootStore';
import { NextPageEditor } from './editor/new';

interface IProps extends AppProps {
  initialValue: initialProps | null | undefined;
}

function MyApp({ Component, pageProps, initialValue }: IProps) {
  const renderLayout = () => {
    if ((Component as NextPageEditor).layout === null) {
      return <Component {...pageProps} />;
    } else {
      return (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      );
    }
  };
  // console.log(initialValue, 'initial');
  return (
    <StoreProvider initialValue={initialValue}>
      {
        renderLayout()
      }
    </StoreProvider>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const pageProps = await App.getInitialProps(appContext);
  if (appContext.ctx.req && appContext.ctx.res) {
    const context: ISession = await getIronSession(
      appContext.ctx.req,
      appContext.ctx.res,
      ironOptions
    );
    console.log(context, 'context');
    const { userId, nickname, avatar } = context || {};
    // const { userId, nickname, avatar } = appContext.ctx.req?.cookies || {};
    // console.log(appContext.ctx.req?.cookies);
    return {
      ...pageProps,
      initialValue: {
        user: {
          userinfo: {
            userId,
            nickname,
            avatar,
          },
        },
      },
    };
  } else {
    return pageProps;
  }
};
// MyApp.getInitialProps = async ({ ctx }: { ctx: any }) => {
//   const { userId, nickname, avatar } = ctx?.req?.cookies || {};

//   return {
//     initialValue: {
//       user: {
//         userInfo: {
//           userId,
//           nickname,
//           avatar,
//         },
//       },
//     },
//   };
// };


export default MyApp;
