import {CreateServiceNodeRequest, GetConfigKeysRequest, ConfigRequest, Response, RunPipelineRequest, SCPRCBaseResponse, ServiceNode, GetConfigResponse} from './types';

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
const endpointConfigKeys: Endpoint = "/get-config-keys";

abstract class RPCBase {
    protected baseURL: string;
    protected port: number;
    constructor(baseURL: string, port: number) {
        this.baseURL = baseURL;
        this.port = port;
    }

    abstract getServicesByParentID(parentID: number) : Promise<Response<ServiceNode[]>>;
    abstract createService(service: CreateServiceNodeRequest): Promise<Response<undefined>>;
    abstract listGithubBranches(id: number): Promise<Response<string[]>>;
    abstract runPipeline(id: number, remoteBranch: string, replicas: number): Promise<Response<string>>;
    abstract getPipelineStage(ID: string): Promise<Response<number>>;
    abstract putConfig(serviceID: string, serviceKey: string, key: string, value: string): Promise<Response<SCPRCBaseResponse>>;
    abstract getConfig(serviceID: string, serviceKey: string, key: string): Promise<Response<{ baseResponse: SCPRCBaseResponse; keyExist: boolean; value: string; }>>;
    abstract configKeys(serviceID: string, serviceKey: string): Promise<Response<{ baseResponse: SCPRCBaseResponse; keys: string[] }>>;
}

class RPCImpl extends RPCBase {
    async configKeys(serviceID: string, serviceKey: string): Promise<Response<{ baseResponse: SCPRCBaseResponse; keys: string[]; }>> {
        return this.fetchInternal<GetConfigKeysRequest, {baseResponse: SCPRCBaseResponse; keys: string[];}>(
            endpointConfigKeys, {
                serviceID, serviceKey,
            }
        );
    }
    async getServicesByParentID(parentID: number): Promise<Response<ServiceNode[]>> {
        return this.fetchInternal<{parentID: number;}, ServiceNode[]>(
            endpointGetService, {
                parentID,
            }
        );
    }
    async createService(service: CreateServiceNodeRequest): Promise<Response<undefined>> {
        return this.fetchInternal<CreateServiceNodeRequest, undefined>(
            endpointCreateService, {
                name: service.name,
                hierarchy: service.hierarchy,
                isService: service.isService,
                parentID: service.parentID,
                gitRepoURL: service.gitRepoURL,
                buildFileRelPath: service.buildFileRelPath,
                type: service.type,
                customPort: service.customPort,
                prefixMapping: service.prefixMapping,
            }
        );
    }
    async listGithubBranches(id: number): Promise<Response<string[]>> {
        return this.fetchInternal<{id: Number}, string[]>(
            endpointListGithubBranches, {
                id,
            }
        );
    }
    async runPipeline(id: number, remoteBranch: string, replicas: number): Promise<Response<string>> {
        return this.fetchInternal<RunPipelineRequest, string>(
            endpointRunPipeline, {
                id, remoteBranch, replicas,
            }
        );
    }
    async getPipelineStage(ID: string): Promise<Response<number>> {
        return this.fetchInternal<{ID: string}, number>(
            endpointGetPipelineStage, {
                ID,
            }
        );
    }
    async putConfig(serviceID: string, serviceKey: string, key: string, value: string): Promise<Response<SCPRCBaseResponse>> {
        return this.fetchInternal<ConfigRequest, SCPRCBaseResponse>(
            endpointPutConfig, {
                serviceID, serviceKey, key, value,
            }
        );
    }
    async getConfig(serviceID: string, serviceKey: string, key: string): Promise<Response<GetConfigResponse>> {
        return this.fetchInternal<ConfigRequest, GetConfigResponse>(
            endpointGetConfig, {
                serviceID, serviceKey, key,
            }
        );
    }

    async fetchInternal<Req, Resp>(endpoint: Endpoint, body: Req): Promise<Response<Resp>> {
        return await fetch(endpoint, {
            method: 'POST', // the project uses POST globally
            mode: "cors",
            cache: "no-cache",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        }).then(res => res.json());
    }

}

class MockRPCImpl extends RPCBase {
    async configKeys(serviceID: string, serviceKey: string): Promise<Response<{ baseResponse: SCPRCBaseResponse; keys: string[]; }>> {
        return {
            code: 200,
            message: {
                baseResponse: {
                    errCode: 0,
                    errMsg: '',
                },
                keys: ['db_config', 'redis_config'],
            }
        }
    }
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
    async createService(service: CreateServiceNodeRequest): Promise<Response<undefined>> {
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
                errMsg: "Success",
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
    let shouldMock = process.env.REACT_APP_MOCK;
    if (shouldMock === undefined) {
        shouldMock = "disabled";
    }
    console.log(`mock:${shouldMock}`);
    if (rpcInstance === undefined) {
        if (shouldMock === "disabled") {
            rpcInstance = new RPCImpl(baseURL, port);
        }else if (shouldMock === "enabled") {
            rpcInstance = new MockRPCImpl("", 0);
        }else {
            throw new Error(`invalid mock flag ${shouldMock}`);
        }
    }

    return rpcInstance;
}