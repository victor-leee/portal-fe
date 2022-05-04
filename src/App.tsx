import './App.css';

import React, { useState } from 'react';
import Sider from 'antd/lib/layout/Sider';
import Layout, { Content } from 'antd/lib/layout/layout';

import ServiceSelector from './components/ServiceSelector';
import MainTab from './components/MainTab';
import { ServiceNode } from './api/types';
import { Alert, Button, Row, Space } from 'antd';

const App: React.FC<{}> = () => {

  const [currentService, setCurrentService] = React.useState<ServiceNode>();

  const onServiceSelect = (node: ServiceNode|undefined) => {
    setCurrentService(node);
  };

  return (
    <>
    <Layout>
      <Sider theme='light'>
        <Space direction='vertical' size='middle' style={{display: 'flex'}}>

        <Row>
          <Button type='primary'>
            Create Service
          </Button>
        </Row>
        <ServiceSelector onServiceSelect={onServiceSelect}/>

        </Space>
      </Sider>
      <Layout>
        <Content style={{background: '#ffffff'}}>
          {currentService === undefined ? 
          <Alert
          showIcon
          message="Hello there"
          description="You must select a service to start"
          type='info'/>
          : <MainTab serviceNode={currentService}/>}
        </Content>
      </Layout>
    </Layout>
    </>
  )
};

export default App;