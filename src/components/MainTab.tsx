import { ServiceNode } from "../api/types";
import { Tabs } from 'antd';
import { DeploymentUnitOutlined, InfoCircleOutlined } from "@ant-design/icons";

const MainTab: React.FC<{
    serviceNode: ServiceNode
}> = ({serviceNode}) => {
    return (
        <>
        <Tabs>
            <Tabs.TabPane
            key={1}
            tab={
                <span>
                    <InfoCircleOutlined />
                    Service
                </span>
            }
            >
                Service Info
                </Tabs.TabPane>
            <Tabs.TabPane
            key={2}
            tab={
                <span>
                    <DeploymentUnitOutlined />
                    Deploy
                </span>
            }
            >
                Deployment
            </Tabs.TabPane>
        </Tabs>
        </>
    )
}

export default MainTab;