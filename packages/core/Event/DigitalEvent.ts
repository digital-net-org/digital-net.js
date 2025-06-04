type DigitalListener<T = any> = (payload: T) => void;

export class DigitalEvent<T = any> {
    private listeners = new Set<DigitalListener<T>>();

    emit(payload: T) {
        this.listeners.forEach(fn => fn(payload));
    }

    subscribe(fn: DigitalListener<T>) {
        this.listeners.add(fn);
        return () => {
            this.listeners.delete(fn);
        };
    }
}
