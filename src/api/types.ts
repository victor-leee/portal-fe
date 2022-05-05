export interface Response<T> {
    code: number,
    message: T
}

export interface SCPRCBaseResponse {
    errCode: number,
    errMsg: string
}

export interface ServiceNode {
    ID: number,
    name: string,
    serviceKey: string,
    isService: boolean,
    parentID: number,
    completePath: string,
    gitRepo: string,
    buildFileRelPath: string,
    type: string,
    customPort: number,
    prefixMapping: string
}

export interface GetConfigKeysRequest {
    serviceID: string;
    serviceKey: string;
}

export interface CreateServiceNodeRequest {
    name: string;
    hierarchy: string[];
    parentID: number;
    isService: boolean;
    gitRepoURL: string;
    buildFileRelPath: string;
    type: string;
    customPort: number;
    prefixMapping: string;
}

export interface RunPipelineRequest {
    id: number;
    remoteBranch: string;
    replicas: number;
}

// Used both in GetConfig and PutConfig scenarios
export interface ConfigRequest {
    serviceID: string;
    serviceKey: string;
    key: string;
    value?: string;
}

export interface GetConfigResponse {
    baseResponse: SCPRCBaseResponse;
    keyExist: boolean;
    value: string;
}