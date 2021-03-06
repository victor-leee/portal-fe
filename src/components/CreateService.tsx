import {Button, Form, Input, Radio, RadioChangeEvent, Row} from 'antd';
import Modal from 'antd/lib/modal/Modal';
import React from 'react';
import {FieldRequired} from './consts';

const serviceNameRegex: RegExp = /^[a-zA-Z-]+$/g;
const gitRepoRegex: RegExp = /^(http|https):\/\/(www\.)?(\S+)\.\w+\/(\S+)\/(\S+)$/g;

const CreateService: React.FC<{}> = () => {

    const [visible, setVisible] = React.useState(false);
    const [isService, setIsService] = React.useState(true);
    const [isHTTP, setIsHTTP] = React.useState(false);

    const onFinish = () => {

    }

    const onFinishFailed = () => {

    }

    return (
        <>
        <Button type='primary' onClick={() => setVisible(true)}>
            Create Service / Directory
        </Button>

        <Modal 
        title='Create Service' 
        visible={visible}
        footer={null}
        width={'50%'}
        onCancel={() => setVisible(false)}>
            <Form
            name='create service'
            labelCol={{span: 9}}
            wrapperCol={{span: 16}}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            initialValues={{
                'service-or-dir': true,
                'service-type': 'sc_rpc',
            }}
            autoComplete='off'>
                <Form.Item
                name='service-or-dir'
                label='Service or Directory'>
                    <Radio.Group>
                        <Radio value={true}
                        onChange={(e: RadioChangeEvent) => setIsService(true)}>
                            Service
                        </Radio>
                        <Radio value={false}
                        onChange={(e: RadioChangeEvent) => setIsService(false)}>
                            Directory
                        </Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                name='name'
                label='Name'
                rules={[{required: true, message: FieldRequired},
                 {pattern: serviceNameRegex, message: 'Only letters(both upper and lower) and "-" supported'}]}
                >
                    <Input placeholder='e.g. charge-center'/>
                </Form.Item>
                <Form.Item
                    name='git'
                    label='Git Repository URL'
                    rules={[
                        {pattern: gitRepoRegex, message: "Unknown git url pattern"},
                        {validator: (_, value) => {
                            if (!isService) {
                                return Promise.resolve();
                            }
                            if (value === undefined || (value as string).length === 0) {
                                return Promise.reject(new Error(FieldRequired));
                            }

                            return Promise.resolve();
                        }}
                    ]}
                >
                    <Input placeholder='https://github.com/organization_name/repo_name'/>
                </Form.Item>
                <Form.Item
                    name='buildFileRelPath'
                    label='Path to Dockerfile'
                >
                    <Input placeholder="Can Ignore if it's in project base dir"/>
                </Form.Item>
                <Form.Item
                    name='service-type'
                    label='Service Type'
                >
                    <Radio.Group>
                        <Radio value='sc_rpc' onChange={(e: RadioChangeEvent) => setIsHTTP(false)}>
                            SCRPC
                        </Radio>
                        <Radio value='http' onChange={(e: RadioChangeEvent) => setIsHTTP(true)}>
                            HTTP
                        </Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    name='custom-port'
                    label='Port of Your Application'
                    rules={[
                        {validator: (_, value) => {
                            if (!isHTTP) {
                                return Promise.resolve();
                            }
                            if (!value) {
                                return Promise.reject(new Error(FieldRequired));
                            }
                            value = parseInt(value);
                            if (isNaN(value) || value <= 0 || value > 65535) {
                                return Promise.reject(new Error('Port Must Be between 1-65535'))
                            }
                            return Promise.resolve();
                        }
                    }
                    ]}
                >
                    <Input placeholder='1-65535'/>
                </Form.Item>
                <Form.Item
                    name='prefix-mapping'
                    label='External Access Prefix'
                    rules={[
                        {validator: (_, value) => {
                            if (!isHTTP) {
                                return Promise.resolve();
                            }
                            if (value === undefined) {
                                return Promise.reject(new Error(FieldRequired));
                            }
                            value = (value as string).trim();
                            if ((value as string).length === 0) {
                                return Promise.reject(new Error(FieldRequired));
                            }
                            if (!(value as string).startsWith('/')) {
                                return Promise.reject(new Error('Path must starts with /'));
                            }

                            return Promise.resolve();
                        }}
                    ]}
                >
                    <Input placeholder='/prefix-you-want'/>
                </Form.Item>

                <Form.Item style={{marginLeft: '40%'}}>
                    <Button type='primary' htmlType='submit'>Submit</Button>
                </Form.Item>
            </Form>
        </Modal>
        </>
    )
}

export default CreateService;