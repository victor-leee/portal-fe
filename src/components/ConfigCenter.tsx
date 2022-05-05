import { Button, Divider, Input, message, Row, Select, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { API } from '../api/api';
import {ServiceNode} from '../api/types';

const ConfigCenter: React.FC<{
    serviceNode: ServiceNode
}> = ({serviceNode}) => {

    const [keys, setKeys] = useState<string[]|null>(null);
    const [newKey, setNewKey] = useState('');
    const [selectedCfgKey, setSelectedCfgKey] = useState('');
    const [selectedCfgValue, setSelectedCfgValue] = useState('');

    useEffect(() => {
        const fetchConfigKeys = async() => {
            const {message} = await API().configKeys(serviceNode.completePath, serviceNode.serviceKey);
            setKeys(message.keys);
        }
        fetchConfigKeys();
    }, [serviceNode.completePath, serviceNode.serviceKey]);

    const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (newKey.trim().length === 0) {
            message.error('Must provide non empty config key');
            return;
        }
        setKeys(original => original === null ? [newKey] : [...original, newKey]);
        setSelectedCfgKey(newKey);
    }

    const handleSelect = async(e: string) => {
        const {message: msg} = await API().getConfig(serviceNode.completePath, serviceNode.serviceKey, e);
        if (!msg.keyExist) {
            message.warn('key not exist on server');
            setKeys(original => original === null ? null : original.filter(w => w !== e));
            return;
        }
        setSelectedCfgKey(e);
        setSelectedCfgValue(msg.value);
    }
    
    const handleCfgChange = async(e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSelectedCfgValue(e.target.value);
    }

    const handleSave = async(e: React.MouseEvent<HTMLButtonElement>) => {
        const {message:{errCode, errMsg}} = await API().putConfig(serviceNode.completePath, serviceNode.serviceKey, selectedCfgKey, selectedCfgValue);
        if (errCode === 0 && errMsg === "") {
            message.success('OK');
        }
    }

    return (
        <>
        <Select
        style={{ width: 300}}
        placeholder='Select a Config Key'
        value={selectedCfgKey}
        onSelect={handleSelect}
        dropdownRender={menu => (
          <>
            {menu}
            <Divider style={{ margin: '8px 0' }}/>
            <Space align='center' style={{ padding: '0 8px 4px' }}>
                <Input 
                placeholder='New Config Key' 
                value={newKey} 
                onChange={e => setNewKey(e.target.value)}
                />
                <Button onClick={handleAdd}>
                    Add
                </Button>
            </Space>
          </>  
        )}
        >
            {
                keys === null ? null : keys.map(key => (
                    <Select.Option key={key}>{key}</Select.Option>
                ))
            }
        </Select>
        <Row style={{marginTop: 16}}>
            <Input.TextArea 
            placeholder='Your Config Here' 
            rows={16} 
            value={selectedCfgValue}
            onChange={handleCfgChange}/>
        </Row>
        <Row style={{marginTop: 16}}>
            <Button onClick={handleSave}>
                Save
            </Button>
        </Row>
        </>
    )
}

export default ConfigCenter;