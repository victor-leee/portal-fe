import { Table } from "antd";
import { ServiceNode } from "../api/types";

const columns = [
    {
        title: 'Service ID',
        dataIndex: 'ID',
        key: 'ID',        
    },
    {
        title: 'Service Name',
        dataIndex: 'name',
        key: 'name'
    },
    {
        title: 'Service Key',
        dataIndex: 'serviceKey',
        key: 'serviceKey',
    },
    {
        title: 'Parent Service ID',
        dataIndex: 'parentID',
        key: 'parentID',
    },
    {
        title: 'Fully Qualified Service Path',
        dataIndex: 'completePath',
        key: 'completePath',
    },
    {
        title: 'Git Repository URL',
        dataIndex: 'gitRepo',
        key: 'gitRepo',
        render: (text: any) => <a href={text}>{text}</a>,
    },
    {
        title: 'Build File Relative Path',
        dataIndex: 'buildFileRelPath',
        key: 'buildFileRelPath',
    },
    {
        title: 'Service Type',
        dataIndex: 'type',
        key: 'type',
    },
    {
        title: 'Custom Port',
        dataIndex: 'customPort',
        key: 'customPort',
    },
    {
        title: 'Prefix',
        dataIndex: 'prefixMapping',
        key: 'prefixMapping',
    },
];

const ServiceInfo: React.FC<{
    ServiceInfo: ServiceNode,
}> = (
    {ServiceInfo},
) => {
    return (
        <>
        <Table columns={columns} dataSource={[{...ServiceInfo, key: 1}]}/>
        </>
    )
}

export default ServiceInfo;