import {ServiceNode} from '../api/types';
import {Button, Divider, Form, InputNumber, message, Modal, Row, Select, Steps} from 'antd';
import React from 'react';
import { API } from '../api/api';
import {FieldRequired, buildStages, stageFail, stageSuccess} from './consts';
import { CheckOutlined, CloseOutlined, LoadingOutlined, PauseCircleOutlined } from '@ant-design/icons';
import { Status } from 'rc-steps/lib/interface';

const iconNotYet = <PauseCircleOutlined />;
const iconProcessing = <LoadingOutlined />;
const iconSucceed = <CheckOutlined />;
const iconError = <CloseOutlined />;

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
    const arr: React.ReactElement[] = new Array(8);
    arr.fill(iconNotYet);
    return arr;
}

const Deployment: React.FC<{
    serviceNode: ServiceNode,
}> = ({serviceNode}) => {

    const [form] = Form.useForm();

    const [visible, setVisible] = React.useState(false);
    const [branches, setBranches] = React.useState<string[]>([]);
    const [statuses, setStatuses] = React.useState<Status[]>(initStatus());
    const [renderIcons, setRenderIcons] = React.useState<React.ReactElement[]>(initIcons());
    const [timer, setTimer] = React.useState<NodeJS.Timer>();

    React.useEffect(() => {
        const fetchBranches = async() => {
            const {message} = await API().listGithubBranches(serviceNode.ID);
            setBranches(message);
        };
        fetchBranches();

        return () => {
            if (timer !== undefined) {
                clearInterval(timer);
            }
        }
    }, []);

    const onFinish = () => {

    };

    const onFinishFailed = () => {

    };

    const handleSubmit = async(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        try {
            await form.validateFields();
        }catch(e) {
            return;
        }
        const branch = form.getFieldValue('branch');
        const replicas = form.getFieldValue('replicas');
        const {message: runID} = await API().runPipeline(serviceNode.ID, branch, replicas);
        message.success('Queue job in pipeline succeed');
        backgroundRefreshStatus(runID);
        setVisible(false);
    }

    const backgroundRefreshStatus = async(runID: string) => {
        const handle = setInterval(async () => {
            const {message: stageID} = await API().getPipelineStage(runID);
            updateProgressBar(stageID);
        }, 2000);
        setTimer(handle);
    }

    const updateProgressBar = (stageID: number) => {
        setRenderIcons(original => {
            return original.map((v, i, a) => {
                if (stageID === stageFail) {
                    return iconError;
                }
                if (stageID === stageSuccess && i <= stageSuccess) {
                    return iconSucceed;
                }

                if (i < stageID) {
                    return iconSucceed;
                }else if (i === stageID) {
                    return iconProcessing;
                }else {
                    return iconNotYet;
                }
            })
        })

        setStatuses(original => {
            return original.map((v, i, a) => {
                if (stageID === stageFail) {
                    return statusError;
                }
                if (stageID == stageSuccess && i <= stageSuccess) {
                    return statusDone;
                }

                if (i < stageID) {
                    return statusDone;
                }else if (i === stageID) {
                    return statusDoing;
                }else {
                    return statusWait;
                }
            })
        })
    }

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
            form={form}
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
                    <Button type='primary' htmlType='submit' onClick={handleSubmit}>Submit</Button>
                </Form.Item>
            </Form>
        </Modal>

        <Divider/>
        <Steps>
            {statuses.map((stage, i, a) => <Steps.Step
            title={buildStages[i]}
            key={i}
            status={statuses[i]}
            icon={renderIcons[i]}
            />)}
        </Steps>
        </>
    )
}

export default Deployment;