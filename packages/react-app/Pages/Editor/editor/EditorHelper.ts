import type { Data } from '@measured/puck';
import { ObjectMatcher } from '@digital-net/core';

export class EditorHelper {
    public static className = 'Editor';

    public static readonly defaultData: Data = {
        root: { props: { title: '' } },
        zones: {},
        content: [],
    };

    public static resolveData(data: unknown): Data {
        if (typeof data === 'string') {
            return JSON.parse(data);
        }
        if (typeof data === 'object' && data !== null) {
            return data as Data;
        }
        return this.defaultData;
    }

    public static deepDataEquality(a: Data, b: unknown): boolean {
        return ObjectMatcher.deepEquality(a, EditorHelper.resolveData(b));
    }
}
