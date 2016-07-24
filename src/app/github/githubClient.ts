/// <reference path="../jquery/jqueryhttpclient.ts" />
/// <reference path="igithubfile.ts" />

module Vienna.Data.Github {
    export class GithubClient implements IGithubClient {
        private baseUrl;
        private baseRepositoriesUrl;
        private repositoryOwner: string;
        private authorizationToken: string;
        private httpClient: IHttpClient;
        private mandatoryHttpHeaders: Array<IHttpHeader>;

        public repositoryName: string;

        constructor(repositoryOwner: string, repositoryName: string, authorizationToken: string) {
            // initialization...
            this.repositoryOwner = repositoryOwner;
            this.repositoryName = repositoryName;
            this.authorizationToken = authorizationToken;

            // rebinding...
            this.getHeads = this.getHeads.bind(this);

            // setting up...
            this.httpClient = new JQueryHttpClient();
            this.baseUrl = "https://api.github.com/repos/{0}/{1}".format(repositoryOwner, repositoryName);
            this.baseRepositoriesUrl = "{0}/git".format(this.baseUrl);
            this.mandatoryHttpHeaders = [{ name: "Authorization", value: "token " + authorizationToken }];
        }

        public getFileContent(path: string): Promise<IGithubFile> {
            return this.httpClient.sendRequest<IGithubFile>({
                url: "{0}/contents/{1}".format(this.baseUrl, path),
                headers: this.mandatoryHttpHeaders
            });
        }

        public getHeads(): Promise<Array<IGithubReference>> {
            // see http://developer.github.com/v3/git/refs/

            return this.httpClient.sendRequest<Array<IGithubReference>>({
                url: "{0}/refs/heads".format(this.baseRepositoriesUrl),
                method: HttpMethod.get,
                headers: this.mandatoryHttpHeaders
            });
        }

        public getCommit(commitSha: string): Promise<IGithubCommit> {
            // see http://developer.github.com/v3/git/commits/

            return this.httpClient.sendRequest<IGithubCommit>({
                url: "{0}/commits/{1}".format(this.baseRepositoriesUrl, commitSha),
                method: HttpMethod.get,
                headers: this.mandatoryHttpHeaders
            });
        }

        public createCommit(parentCommitSha: string, tree: string, message: string): Promise<IGithubCommit> {
            // see http://developer.github.com/v3/git/commits/

            var requestBody = {
                "message": message,
                "tree": tree,
                "parents": parentCommitSha ? [parentCommitSha] : []
            };
            
            return this.httpClient.sendRequest<IGithubCommit>({
                url: "{0}/commits".format(this.baseRepositoriesUrl),
                method: HttpMethod.post,
                headers: this.mandatoryHttpHeaders,
                body: JSON.stringify(requestBody)
            });
        }

        public getTree(treeSha: string): Promise<IGithubGetTreeResponse> {
            return this.httpClient.sendRequest<IGithubGetTreeResponse>({
                url: "{0}/trees/{1}?recursive=1".format(this.baseRepositoriesUrl, treeSha),
                method: HttpMethod.get,
                headers: this.mandatoryHttpHeaders
            });
        }

        public createTree(baseTreeSha: string, treeItems: Array<IGithubTreeItem>): Promise<IGithubCreateTreeResponse> {
            // see http://developer.github.com/v3/git/trees/

            var tree = new Array<Object>();

            treeItems.forEach(treeItem => {
                tree.push({
                    "path": treeItem.path,
                    "sha": treeItem.sha,
                    "mode": GithubMode.file,
                    "type": GithubTreeItemType.blob
                });
            });

            var requestBody = {
                "base_tree": baseTreeSha,
                "tree": tree
            };
            return this.httpClient.sendRequest<IGithubCreateTreeResponse>({
                url: "{0}/trees".format(this.baseRepositoriesUrl),
                method: HttpMethod.post,
                headers: this.mandatoryHttpHeaders,
                body: JSON.stringify(requestBody)
            });
        }

        public createReference(branch: string, commitSha: string) {
            // see http://developer.github.com/v3/git/refs/
            
            var requestBody = {
                "ref": "refs/heads/{0}".format(branch),
                "sha": commitSha
            };
            return this.httpClient.sendRequest({
                url: "{0}/refs".format(this.baseRepositoriesUrl),
                method: HttpMethod.post,
                headers: this.mandatoryHttpHeaders,
                body: JSON.stringify(requestBody)
            });
        }

        public deleteReference(branch: string) {
            // see http://developer.github.com/v3/git/refs/

            return this.httpClient.sendRequest({
                url: "{0}/refs/heads/{1}".format(this.baseRepositoriesUrl, branch),
                method: HttpMethod.delete,
                headers: this.mandatoryHttpHeaders
            });
        }

        public deleteFile(path: string, blobSha: string, commitMsg: string) {
            // see https://developer.github.com/v3/repos/contents/
            
            var requestBody = {
                "sha": blobSha,
                "message": commitMsg,
                "branch": "master"
            };

            return this.httpClient.sendRequest({
                url: "{0}/contents/{1}".format(this.baseUrl, path),
                method: HttpMethod.delete,
                headers: this.mandatoryHttpHeaders,
                body: JSON.stringify(requestBody)
            });
        }

        public updateReference(branch: string, commitSha: string): Promise<IGithubReference> {
            // see http://developer.github.com/v3/git/refs/

            var requestBody = {
                "sha": commitSha,
                "force": true
            };
            return this.httpClient.sendRequest<IGithubReference>({
                url: "{0}/refs/heads/{1}".format(this.baseRepositoriesUrl, branch),
                method: HttpMethod.patch,
                headers: this.mandatoryHttpHeaders,
                body: JSON.stringify(requestBody)
            });
        }

        public push(treeItems: Array<IGithubTreeItem>, message: string = null, branch: string = "master"): Promise<IGithubReference> {
            // get the head of the master branch
            return this.getHeads().then(heads => {
                var lastCommitReference = _.last(heads).object;
                // get the last commit
                return this.getCommit(lastCommitReference.sha);
            }).then(lastCommit => {
                // create tree object (also implicitly creates a blob based on content)
                return this.createTree(lastCommit.tree.sha, treeItems).then(response => {
                    if (!message)
                        message = moment().format("MM/DD/YYYY, hh:mm:ss");
                    // create new commit
                    return this.createCommit(lastCommit.sha, response.sha, message);
                // update branch to point to new commit
                }).then(newCommit => this.updateReference(branch, newCommit.sha))
            }).then(head => {
                console.log("Pushed to git");
                return head;
            });
        }

        public pushBase64Content(path: string, content: string, message: string = null, branch: string = "master"): Promise<IGithubCreateBlobReponse> {
            var createBlobTask = this.createBlob(content);

            createBlobTask.then((response: IGithubCreateBlobReponse) => {
                var treeItem: IGithubTreeItem = {
                    path: path,
                    sha: response.sha
                };
                this.push([treeItem], message, branch);
            });

            return createBlobTask;
        }

        public getBlob(blobSha: string): Promise<IGithubBlob> {
            return this.httpClient.sendRequest({
                url: "{0}/blobs/{1}".format(this.baseRepositoriesUrl, blobSha),
                method: HttpMethod.get,
                headers: this.mandatoryHttpHeaders
            }).then((getBlobReponse: IGetBlobResponse) => {
                var blob: IGithubBlob = {
                    content: atob(getBlobReponse.content),
                    path: ""
                };
                return blob;
            });
        }

        public createBlob(content: string, encoding: string = "base64"): Promise<IGithubCreateBlobReponse> {
            var contentEncoded;
            if (encoding == "base64") {
                contentEncoded = btoa(content);
            }
            var requestBody = {
                content: contentEncoded || content,
                encoding: encoding
            };
            return this.httpClient.sendRequest<IGithubCreateBlobReponse>({
                url: "{0}/blobs".format(this.baseRepositoriesUrl),
                method: HttpMethod.post,
                headers: this.mandatoryHttpHeaders,
                body: JSON.stringify(requestBody)
            });
        }

        public getLatestCommitTree(): Promise<IGithubGetTreeResponse> {
            // get the head of the master branch
            return this.getHeads().then (heads => {
                var lastCommitReference: IGithubObject = _.last(heads).object;
                // get the last commit
                return this.getCommit(lastCommitReference.sha);                
            }).then(lastCommit => {
                return this.getTree(lastCommit.tree.sha).then(getTreeResponse => {
                    getTreeResponse.lastCommit = lastCommit;
                    return getTreeResponse;
                });
            });
        }

        public getLatestCommit(): Promise<IGithubCommit> {
            // get the head of the master branch
            return this.getHeads().then(heads => {
                var lastCommitReference: IGithubObject = _.last(heads).object;
                // get the last commit
                return this.getCommit(lastCommitReference.sha)
            })
        }
    }
}
