import {Response, SCPRCBaseResponse, ServiceNode} from './types';

const baseURL = "localhost";
const port = 80;

type Endpoint = string;
const endpointGetService: Endpoint = "/query-by-parent-id";
const endpointCreateService: Endpoint = "/create-service";
const endpointListGithubBranches: Endpoint = "/list-branches";
const endpointRunPipeline: Endpoint = "/run-pipeline";
const endpointGetPipelineStage: Endpoint = "/pipeline-stage";
const endpointPutConfig: Endpoint = "/put-config";
const endpointGetConfig: Endpoint = "/get-config";

abstract class RPCBase {
    protected baseURL: string;
    protected port: number;
    constructor(baseURL: string, port: number) {
        this.baseURL = baseURL;
        this.port = port;
    }

    abstract getServicesByParentID(parentID: number) : Promise<Response<ServiceNode[]>>;
    abstract createService(service: ServiceNode): Promise<Response<undefined>>;
    abstract listGithubBranches(id: number): Promise<Response<string[]>>;
    abstract runPipeline(id: number, remoteBranch: string, replicas: number): Promise<Response<string>>;
    abstract getPipelineStage(ID: string): Promise<Response<number>>;
    abstract putConfig(serviceID: string, serviceKey: string, key: string, value: string): Promise<Response<SCPRCBaseResponse>>;
    abstract getConfig(serviceID: string, serviceKey: string, key: string): Promise<Response<{ baseResponse: SCPRCBaseResponse; keyExist: boolean; value: string; }>>;
}

class RPCImpl extends RPCBase {
    async getServicesByParentID(parentID: number): Promise<Response<ServiceNode[]>> {
        throw new Error('Method not implemented.');
    }
    async createService(service: ServiceNode): Promise<Response<undefined>> {
        throw new Error('Method not implemented.');
    }
    async listGithubBranches(id: number): Promise<Response<string[]>> {
        throw new Error('Method not implemented.');
    }
    async runPipeline(id: number, remoteBranch: string, replicas: number): Promise<Response<string>> {
        throw new Error('Method not implemented.');
    }
    async getPipelineStage(ID: string): Promise<Response<number>> {
        throw new Error('Method not implemented.');
    }
    async putConfig(serviceID: string, serviceKey: string, key: string, value: string): Promise<Response<SCPRCBaseResponse>> {
        throw new Error('Method not implemented.');
    }
    async getConfig(serviceID: string, serviceKey: string, key: string): Promise<Response<{ baseResponse: SCPRCBaseResponse; keyExist: boolean; value: string; }>> {
        throw new Error('Method not implemented.');
    }

}

class MockRPCImpl extends RPCBase {
    async getServicesByParentID(parentID: number): Promise<Response<ServiceNode[]>> {
        if (parentID === 1) {
            return {
                code: 200,
                message: [
                    {
                        ID: 3,
                        name: "mock-client-sub",
                        serviceKey: "adspi9e8sf",
                        isService: true,
                        parentID: 1,
                        completePath: "mock-client-sub-github-com",
                        gitRepo: "github.com/victor-leee/hhh.git",
                        buildFileRelPath: "",
                        type: "http",
                        customPort: 8080,
                        prefixMapping: "/test-mock-client-sub",
                    }
                ]
            }
        }
        return {
            code: 200,
            message: [
                {
                    ID: 1,
                    name: "mock",
                    serviceKey: "",
                    isService: false,
                    parentID: 0,
                    completePath: "mock-client-github-com",
                    gitRepo: "github.com/victor-leee/hhh.git",
                    buildFileRelPath: "",
                    type: "http",
                    customPort: 8080,
                    prefixMapping: "/test-mock-client",
                },
                {
                    ID: 2,
                    name: "mock-server",
                    serviceKey: "asdfuiyouyio",
                    isService: true,
                    parentID: 0,
                    completePath: "mock-server-github-com",
                    gitRepo: "github.com/victor-leee/hhhaaaaaa.git",
                    buildFileRelPath: "",
                    type: "sc_rpc",
                    customPort: 0,
                    prefixMapping: "",
                },
            ]   
        }
    }
    async createService(service: ServiceNode): Promise<Response<undefined>> {
        return {
            code: 200,
            message: undefined,
        }
    }
    async listGithubBranches(id: number): Promise<Response<string[]>> {
        return {
            code: 200,
            message: [
                "master",
                "JIRA-TIC-1",
                "JIRA-TIC-2"
            ]
        }
    }
    async runPipeline(id: number, remoteBranch: string, replicas: number): Promise<Response<string>> {
        return {
            code: 200,
            message: "foobar",
        }
    }
    async getPipelineStage(ID: string): Promise<Response<number>> {
        return {
            code: 200,
            message: this.randomInteger(0, 8)
        }
    }
    async putConfig(serviceID: string, serviceKey: string, key: string, value: string): Promise<Response<SCPRCBaseResponse>> {
        return {
            code: 200,
            message: {
                errCode: 0,
                errMsg: "",
            }
        }
    }
    async getConfig(serviceID: string, serviceKey: string, key: string): Promise<Response<{ baseResponse: SCPRCBaseResponse; keyExist: boolean; value: string; }>> {
        return {
            code: 200,
            message: {
                baseResponse: {
                    errCode: 0,
                    errMsg: ""
                },
                keyExist: true,
                value: "foo"
            }
        }
    }

    // [min, max)
    randomInteger(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }
    
}

let rpcInstance: RPCBase;

export function API() {
    if (rpcInstance === undefined) {
        rpcInstance = new MockRPCImpl("", 0);
    }

    return rpcInstance;
}