module Vienna.Data.Github {
    export interface IGithubReference {
        ref: string;
        url: string;
        object: Data.Github.IGithubObject;
    }
}