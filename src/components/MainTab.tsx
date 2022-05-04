import { ServiceNode } from "../api/types";
import { Tabs } from 'antd';
import { CloudServerOutlined, InfoCircleOutlined } from "@ant-design/icons";
import Deployment from './Deployment';

import ServiceInfo from './ServiceInfo';

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
                <ServiceInfo ServiceInfo={serviceNode}/>
                </Tabs.TabPane>
            <Tabs.TabPane
            key={2}
            tab={
                <span>
                    <svg className="icon" aria-hidden={true}>
                        <use xlinkHref="#icon-kubernetes"></use>
                    </svg>
                    Deploy
                </span>
            }
            >
                <Deployment serviceNode={serviceNode}/>
            </Tabs.TabPane>
            <Tabs.TabPane
            key={3}
            tab={
                <span>
                    <CloudServerOutlined />
                    Configuration Center
                </span>
            }
            >
                Config
            </Tabs.TabPane>
        </Tabs>
        </>
    )
}

export default MainTab;