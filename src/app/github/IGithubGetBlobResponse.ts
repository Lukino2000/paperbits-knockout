module Vienna.Data.Github {
    export interface IGetBlobResponse {
        sha: string;
        content: string;
        encoding: string;
        size: number;
    }
}