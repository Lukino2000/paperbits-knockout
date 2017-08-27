import * as fs from "fs";
import * as path from "path";
import * as mkdirp from "mkdirp";
import { ProgressPromise } from "@paperbits/common/core/progressPromise";
import { IBlobStorage } from "@paperbits/common/persistence/IBlobStorage";


export class FileSystemBlobStorage implements IBlobStorage {
    private basePath: string;

    constructor(basePath: string) {
        this.basePath = basePath;
    }

    public uploadBlob(blobPath: string, content: Uint8Array): ProgressPromise<void> {
        return new ProgressPromise<void>((resolve, reject) => {
            let partPath = blobPath.replace("//", "/");
            let fullpath = `${this.basePath}/${partPath}`;

            mkdirp(path.dirname(fullpath), (error) => {
                if (error) {
                    console.error(error);
                    reject(error);
                }
                else {
                    fs.writeFile(fullpath, new Buffer(content), error => {
                        if (error) {
                            reject(error);
                        }
                        resolve();
                    });
                }
            });
        });
    }

    public downloadBlob(blobPath: string): Promise<Uint8Array> {
        return new Promise<Uint8Array>((resolve, reject) => {
            let fullpath = `${this.basePath}/${blobPath}`;

            fs.readFile(fullpath, function (error, buffer: Buffer) {
                if (error) {
                    reject(error);
                }

                let arrayBuffer = new ArrayBuffer(buffer.length);
                let unit8Array = new Uint8Array(arrayBuffer);

                for (let i = 0; i < buffer.length; ++i) {
                    unit8Array[i] = buffer[i];
                }

                resolve(unit8Array);
            });
        });
    }

    public async listBlobs(): Promise<Array<string>> {
        function getFilesFromDir(dir, fileTypes?) {
            let resolvedPath = path.resolve(dir);
            let filesToReturn = [];

            function walkDir(currentPath) {
                let files = fs.readdirSync(currentPath);

                for (let i = 0; i < files.length; i++) {
                    let curFile = path.join(currentPath, files[i]);

                    if (fs.statSync(curFile).isFile()) {
                        let filepath = curFile.replace(dir, "").replace(/\\/g, '\/');
                        filesToReturn.push(filepath);
                    }
                    else if (fs.statSync(curFile).isDirectory()) {
                        walkDir(curFile);
                    }
                }
            };

            walkDir(dir);

            return filesToReturn;
        }

        //print the txt files in the current directory
        return getFilesFromDir(this.basePath);
    }

    public getDownloadUrl(filename: string): Promise<string> {
        throw "Not supported";
    }

    public deleteBlob(filename: string): Promise<void> {
        return null;
    }
}