module Vienna.Data.Github {
    export interface IGithubGetTreeResponse {
        sha: string;
        tree: Array<Github.IGithubTreeItem>;
        truncated:boolean;
        url:string;
        lastCommit?:IGithubCommit;
    }
}