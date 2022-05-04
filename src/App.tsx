import './App.css';


import React from 'react';
import Sider from 'antd/lib/layout/Sider';
import Layout, { Content, Footer, Header } from 'antd/lib/layout/layout';

import ServiceSelector from './components/ServiceSelector';

const App: React.FC<{}> = () => {
  return (
    <>
    <Layout>
      <Sider>
        <ServiceSelector/>
      </Sider>
      <Layout>
        <Header>
          HEADER
        </Header>
        <Content>
          CONTENT
        </Content>
        <Footer>
          FOOTER
        </Footer>
      </Layout>
    </Layout>
    </>
  )
};

export default App;