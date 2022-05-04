import { useState } from 'react';
import {Tree} from 'antd';
import './App.css';
import React from 'react';
import {API} from './api/api';
import { ServiceNode } from './api/types';

interface DataNode {
  title: string;
  key: number;
  isLeaf?: boolean;
  children?: DataNode[];
}

function updateTreeData(list: DataNode[], key: React.Key, children: DataNode[]): DataNode[] {
  return list.map(node => {
    if (node.key === key) {
      return {
        ...node,
        children,
      };
    }
    if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, key, children),
      };
    }
    return node;
  });
}

const App: React.FC<{}> = () => {
  const [treeData, setTreeData] = useState<DataNode[]>([]);

  const onLoadData = ({ key }: any) =>
    new Promise<void>(resolve => {
      setTimeout(async () => {
        const {message} = await API().getServicesByParentID(key);
        setTreeData(origin => {
          return updateTreeData(origin, key, message.map(convertServiceNode2DataNode));
        })
        resolve();
      }, 1000);
    });


  const convertServiceNode2DataNode = (serviceNode: ServiceNode): DataNode => {
    return {
      title: serviceNode.name,
      key: serviceNode.ID,
      isLeaf: serviceNode.isService,
      children: [],
    }
  }

  React.useEffect(() => {
    const fetch = async() => {
      const {message} = await API().getServicesByParentID(0);
      setTreeData(message.map(convertServiceNode2DataNode));
    };
    fetch();
  }, []);

  return (
    <>
      <Tree loadData={onLoadData} treeData={treeData} />;
    </>
  )
};

export default App;