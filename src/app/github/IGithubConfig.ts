module Vienna.Data.Github {
    export interface IGithubConfig {
        repository: string;
        repositoryOwner: string;
        authorizationKey: string;
    }
}