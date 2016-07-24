module Vienna.Data.Github {
    export interface IGithubCreateTreeResponse {
        sha: string;
        url: string;
        truncated: boolean;
    }
}