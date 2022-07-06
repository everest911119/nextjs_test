import type { NextPage } from 'next';
import React from 'react';
import Footer from 'components/Footer';
import Navbar from 'components/Navbar';
export interface LayoutProps {
  children: React.ReactNode | undefined;
}

const Layout: NextPage<LayoutProps> = ({ children }) => {
  return (
    <div>
      <Navbar></Navbar>
      <main>{children}</main>
      <Footer />
    </div>
  );
};
export default Layout;
