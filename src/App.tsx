import './App.css';

import React from 'react';
import Sider from 'antd/lib/layout/Sider';
import Layout, { Content } from 'antd/lib/layout/layout';

import ServiceSelector from './components/ServiceSelector';
import MainTab from './components/MainTab';
import CreateService from './components/CreateService';
import { ServiceNode } from './api/types';
import { Alert, Row, Space } from 'antd';

const App: React.FC<{}> = () => {

  const [currentService, setCurrentService] = React.useState<ServiceNode>();
  const [selectPath, setSelectPath] = React.useState<ServiceNode[]>();

  const onServiceSelect = (node: ServiceNode|undefined, path: ServiceNode[]|undefined) => {
    setCurrentService(node);
    setSelectPath(path);
  };

  return (
    <>
    <Layout>
      <Sider theme='light'>
        <Space direction='vertical' size='middle' style={{display: 'flex'}}>

        <Row>
          <CreateService 
          parentID={selectPath === undefined ? 0 : selectPath[0].ID}
          hierarchy={selectPath === undefined ? [] : selectPath?.map(node => node.name).reverse()}
          />
        </Row>
        <ServiceSelector onServiceSelect={onServiceSelect}/>

        </Space>
      </Sider>
      <Layout>
        <Content style={{background: '#ffffff'}}>
          {currentService === undefined || !currentService.isService ? 
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