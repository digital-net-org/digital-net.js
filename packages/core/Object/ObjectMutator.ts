export class ObjectMutator {
    /**
     * Delete recursively all entries when the value is undefined
     * @param obj - object to clean
     * @return object returned without entries with undefined values
     */
    public static deleteUndefinedEntries(obj: any) {
        const object = { ...obj };
        for (const key of Object.keys(object)) {
            if (typeof object[key] === 'object') {
                object[key] = this.deleteUndefinedEntries(object[key]);
            }
            if (object[key] === undefined) {
                delete object[key];
            }
        }
        return object;
    }
}
