import {ServiceNode} from '../api/types';
import {Button, Form, Input, Modal, Row, Select} from 'antd';
import React from 'react';
import { API } from '../api/api';
import {FieldRequired} from './consts';

const Deployment: React.FC<{
    serviceNode: ServiceNode,
}> = ({serviceNode}) => {

    const [visible, setVisible] = React.useState(false);
    const [branches, setBranches] = React.useState<string[]>([]);

    React.useEffect(() => {
        const fetchBranches = async() => {
            const {message} = await API().listGithubBranches(serviceNode.ID);
            setBranches(message);
        };
        fetchBranches();
    }, []);

    const onFinish = () => {

    };

    const onFinishFailed = () => {

    };

    return (
        <>
        <Row>
            <Button type='primary' onClick={() => setVisible(true)}>
                Run Pipeline
            </Button>
        </Row>

        <Modal
        title="Deployment Config"
        visible={visible}
        footer={null}
        onCancel={() => setVisible(false)}
        >
            <Form
            name='create deployment'
            labelCol={{span: 9}}
            wrapperCol={{span: 16}}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete='off'
            >
                <Form.Item
                    name='branch' label='Select Branch' rules={[{required: true, message: FieldRequired}]}
                >
                    <Select
                    placeholder='Must select a git branch to deploy'
                    allowClear>
                        {branches.map((name, i, a) => 
                        <Select.Option key={i} value={name}>{name}</Select.Option>)}
                    </Select>
                </Form.Item>
                <Form.Item
                name='replicas'
                label='Number of replicas'
                rules={[{required: true, message: FieldRequired},
                {type: 'number', min: 1, message:'Replica count must be positive'}]}
                >
                    <Input type='number' defaultValue={1}/>
                </Form.Item>
                <Form.Item style={{marginLeft: '40%'}}>
                    <Button type='primary' htmlType='submit'>Submit</Button>
                </Form.Item>
            </Form>
        </Modal>
        </>
    )
}

export default Deployment;