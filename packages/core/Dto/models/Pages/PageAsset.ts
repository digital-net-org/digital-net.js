import type { PageAssetLight } from './PageAssetLight';

export interface PageAsset extends PageAssetLight {
    fileName: string;
    fileSize: number;
}
