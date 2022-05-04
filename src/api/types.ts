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