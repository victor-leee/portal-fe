import {ServiceNode} from '../api/types';
import {Button, Divider, Form, Input, InputNumber, Modal, Row, Select, Steps} from 'antd';
import React from 'react';
import { API } from '../api/api';
import {FieldRequired, buildStages} from './consts';
import { CheckOutlined, LoadingOutlined, PauseCircleOutlined, QuestionOutlined } from '@ant-design/icons';
import { Status } from 'rc-steps/lib/interface';

const iconNotYet = <PauseCircleOutlined />;
const iconProcessing = <LoadingOutlined />;
const iconReached = <CheckOutlined />;

const statusWait = "wait";
const statusDoing = "process";
const statusDone = "finish";
const statusError = "error";

const initStatus = () => {
    const arr: Status[] = new Array(8);
    arr.fill(statusWait);
    return arr;
}

const initIcons = () => {
    const arr: React.ReactNode[] = new Array(8);
    arr.fill(iconNotYet);
    return arr;
}

const Deployment: React.FC<{
    serviceNode: ServiceNode,
}> = ({serviceNode}) => {

    const [visible, setVisible] = React.useState(false);
    const [branches, setBranches] = React.useState<string[]>([]);
    const [statuses, setStatuses] = React.useState<Status[]>(initStatus());
    const [icons, setIcons] = React.useState<React.ReactNode[]>(initIcons());

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
            initialValues={{
                'replicas': 1,
            }}
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
                    <InputNumber/>
                </Form.Item>
                <Form.Item style={{marginLeft: '40%'}}>
                    <Button type='primary' htmlType='submit'>Submit</Button>
                </Form.Item>
            </Form>
        </Modal>

        <Divider/>
        <Steps>
            {buildStages.map((stage, i, a) => <Steps.Step
            title={buildStages[i]}
            key={i}
            status={statuses[i]}
            icon={icons[i]}
            />)}
        </Steps>
        </>
    )
}

export default Deployment;