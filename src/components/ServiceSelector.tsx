import React, { Key } from 'react';
import { useState } from 'react';
import {API} from '../api/api';
import { ServiceNode } from '../api/types';
import {message, Tree} from 'antd';
import { FileOutlined } from '@ant-design/icons';

interface DataNode {
    title: string;
    key: number;
    icon?: any;
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
  
const id2ServiceNode: Map<number, ServiceNode> = new Map();

const ServiceSelector: React.FC<{
  onServiceSelect: (node: ServiceNode|undefined) => void,
}> = ({onServiceSelect}) => {
    const [treeData, setTreeData] = useState<DataNode[]>([]);

    const onLoadData = ({ key }: any) =>
      new Promise<void>(resolve => {
        setTimeout(async () => {
          const {message} = await API().getServicesByParentID(key);
          message.forEach((service, i, a) => {
            id2ServiceNode.set(service.ID, service);
          });
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
        icon: serviceNode.isService ? <FileOutlined />: null,
      }
    }
  
    React.useEffect(() => {
      const fetch = async() => {
        const {message} = await API().getServicesByParentID(0);
        message.forEach((service, i, a) => {
          id2ServiceNode.set(service.ID, service);
        });
        setTreeData(message.map(convertServiceNode2DataNode));
      };
      fetch();
    }, []);

    const handleSelect = (k: Key[], e: {selected: boolean}) => {
      const key = k[0] as number;
      const service = id2ServiceNode.get(key);
      if (service === undefined) {
        message.error('service not found');
        return;
      }
      if (e.selected) {
        onServiceSelect(service);
        return;
      }
      onServiceSelect(undefined);
    }

    return (
        <>
        <Tree showIcon treeData={treeData} loadData={onLoadData} onSelect={handleSelect}/>
        </>
    )
}

export default ServiceSelector;