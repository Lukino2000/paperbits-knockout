module Vienna.Data.Github {
    export interface IGithubClient {
        repositoryName: string;

        pushBase64Content(path: string, content: string): Promise<IGithubCreateBlobReponse>;
        pushBase64Content(path: string, content: string, message: string): Promise<IGithubCreateBlobReponse>;
        pushBase64Content(path: string, content: string, message: string, branch: string): Promise<IGithubCreateBlobReponse>;
    }
}