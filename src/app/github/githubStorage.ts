module Vienna.Data.Github {

    export class GithubStorage implements Persistence.IObjectStorage {
        private localCache: ILocalCache;
        private githubClient: GithubClient;
        private indexFileName: string;
        public index: IBag<Persistence.IFileReference>;

        constructor(localCache: ILocalCache, githubClient: GithubClient) {
            this.localCache = localCache;
            this.githubClient = githubClient;

            //rebinding...
            this.saveChanges = this.saveChanges.bind(this);

            this.index = {};
            this.indexFileName = githubClient.repositoryName;
        }

        private getIndex(): Promise<IBag<Persistence.IFileReference>> {
            if (!this.index[this.indexFileName]) {
                var indexFileContent = this.localCache.getItem<string>(this.indexFileName);

                if (indexFileContent) {
                    this.index = JSON.parse(indexFileContent);

                    return Promise.resolve(this.index);
                }

                return this.githubClient.getFileContent(this.indexFileName).then((file: IGithubFile) => {
                    var decodedContent = atob(file.content);
                    this.index = JSON.parse(decodedContent);
                    this.saveIndex();

                    return this.index;
                });
            }
            else {
                return Promise.resolve(this.index);
            }
        }

        private saveIndex() {
            this.localCache.setItem(this.indexFileName, JSON.stringify(this.index));
        }

        public saveChanges(): void {
            var keys = this.localCache.getKeys();

            if (!keys || !keys.length) {
                return;
            }

            var getLatestCommitTask = this.githubClient.getLatestCommit();

            getLatestCommitTask.then((lastCommit: IGithubCommit) => {
                var newTreeTask = this.createChangesTree();

                newTreeTask.then((newTree) => {
                    this.githubClient.createTree(null, newTree).then((createTreeResponse) => {
                        var tree: Github.IGithubCreateTreeResponse = createTreeResponse;
                        var message = "commit: {0}".format(moment().format("MM/DD/YYYY, hh:mm:ss"));
                        var createCommitTask = this.githubClient.createCommit(lastCommit.sha, tree.sha, message);

                        createCommitTask.then((newCommit: Github.IGithubCommit) => {
                            var updateReferenceTask = this.githubClient.updateReference("master", newCommit.sha);
                            updateReferenceTask.then((head: Github.IGithubReference) => {
                                console.log("Pushed!");
                                this.saveIndex();
                            });
                        });
                    });

                });
            });
        }

        private createChangesTree(): Promise<Array<Github.IGithubTreeItem>> {
            var newTree = new Array<Github.IGithubTreeItem>();
            var createBlobTasks = new Array<Promise<any>>();
            var keys = Object.keys(this.index);
            var needToUpdateIndex = false;

            keys.forEach((key: string) => {
                var record = this.index[key];

                if (record.path != this.indexFileName) {
                    var newTreeItem: Github.IGithubTreeItem = {
                        path: record.path
                    };

                    newTree.push(newTreeItem);

                    var fileAddedOrUpdated = !record.metadata["sha"] && record.path != this.indexFileName;

                    if (fileAddedOrUpdated) {
                        console.log("Uploading " + record.path);
                        var content = this.localCache.getItem<string>(record.path);

                        if (!content || content.length == 0) {
                            throw "Empty content!";
                        }

                        var createBlobTask = this.githubClient.createBlob(content);

                        createBlobTask.then((response: Github.IGithubCreateBlobReponse) => {
                            newTreeItem.sha = response.sha;
                            record.metadata["sha"] = response.sha;
                            needToUpdateIndex = true;
                        });

                        createBlobTasks.push(createBlobTask);
                    }
                    else {
                        newTreeItem.sha = record.metadata["sha"];
                    }
                }
            });

            return Promise.all(createBlobTasks).then(() => {
                if (needToUpdateIndex) {
                    console.log("Uploading index file.");
                    var createBlobTask = this.githubClient.createBlob(JSON.stringify(this.index));

                    createBlobTask.then((response: Github.IGithubCreateBlobReponse) => {
                        var sha = response.sha;

                        var newTreeItem: Github.IGithubTreeItem = {
                            path: this.indexFileName,
                            sha: sha
                        };

                        newTree.push(newTreeItem);

                        return newTree;
                    });
                }
                else {
                    return newTree;
                }
            });
        }

        // addObject<T>(path:string, content:T, metadata:Vienna.IBag<string>) {
        //     this.localCache.setItem(path, content);
        //
        //     this.index[path] = {
        //         path: path,
        //         metadata: metadata
        //     };
        //     this.saveIndex();
        // }
        
        addObject(path:string, dataObject:any): Promise<void> {
            return undefined;
        }

        searchObjects<T>(path:string, propertyNames?:Array<string>, searchValue?:string, startAtSearch?:boolean, loadObject = true): Promise<Array<T>> {
            return undefined;
        }

        searchObjectsByMetadata(path: string, metadataKey: Array<string>, metadataValue: string, exactSearch: boolean): Promise<Array<Persistence.IFileReference>> {
            return this.getIndex().then((index: IBag<Persistence.IFileReference>) => {
                var result = new Array<Persistence.IFileReference>();

                for (var key in index) {
                    var record = index[key];

                    if (!record.path.startsWith(path))
                        continue;

                    if (exactSearch) {
                        if (metadataKey.any(tag => record.metadata[tag] == metadataValue)) {
                            result.push(record);
                        }
                    }
                    else {
                        if (metadataKey.any(tag => record.metadata[tag].contains(metadataValue))) {
                            result.push(record);
                        }
                    }
                }

                return result;
            });
        }

        getObject<T>(path:string): Promise<T> {
            var cachedFile = this.localCache.getItem<T>(path);

            if (cachedFile) {
                return Promise.resolve(cachedFile);
            }

            return this.githubClient.getFileContent(path).then((file: IGithubFile) => {
                var decodedContent = JSON.parse(atob(file.content));
                this.localCache.setItem(path, decodedContent);
                return decodedContent;
            });
        }

        updateObject<T>(path: string, dataObject: T): Promise<T>{
            var original = this.localCache.getItem(path);

            if (!_.isEqual(original, dataObject)) {
                this.localCache.setItem(path, dataObject);

                var reference: Persistence.IFileReference = this.index[path];

                reference.metadata["sha"] = null; //means that we need a new blob
            }

            return Promise.resolve(dataObject);
        }

        // updateObject<T>(path:string, content:T) {
        //     var original = this.localCache.getItem(path);
        //
        //     if (!_.isEqual(original, content)) {
        //         this.localCache.setItem(path, content);
        //
        //         var reference: Persistence.IFileReference = this.index[path];
        //
        //         reference.metadata["sha"] = null; //means that we need a new blob
        //     }
        // }

        updateObjectsMetadata(path: string, metadata: IBag<string>) {
            var reference: Persistence.IFileReference = this.index[path];
            $.extend(reference.metadata, metadata);
        }

        deleteObject(path: string): Promise<void> {
            delete this.index[path];

            this.localCache.removeItem(path); // track deleting to propagate to github

            return Promise.resolve<void>();
        }
    }
}
