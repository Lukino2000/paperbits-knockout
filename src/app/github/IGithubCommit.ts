module Vienna.Data.Github {
    export interface IGithubCommit {
        author: any;
        committer: any;
        sha: string;
        tree: Github.IGithubTree;
        url: string;
    }
}