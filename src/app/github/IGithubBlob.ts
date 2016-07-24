module Vienna.Data.Github {
    export interface IGithubBlob {
        content: string;
        encoding?: string;
        path?: string;
    }
}