export interface SseEvent {
    id?: string;
    event?: string;
    data: string;
}

export class SseParser {
    private buffer = '';

    public push(chunk: string): SseEvent[] {
        this.buffer += chunk.replace(/\r\n/g, '\n');
        const events: SseEvent[] = [];

        let separatorIndex = this.buffer.indexOf('\n\n');
        while (separatorIndex !== -1) {
            const raw = this.buffer.slice(0, separatorIndex);
            this.buffer = this.buffer.slice(separatorIndex + 2);
            const parsed = this.parseEvent(raw);
            if (parsed) {
                events.push(parsed);
            }
            separatorIndex = this.buffer.indexOf('\n\n');
        }
        return events;
    }

    private parseEvent(raw: string): SseEvent | null {
        const event: SseEvent = { data: '' };
        const dataLines: string[] = [];

        for (const line of raw.split('\n')) {
            if (!line || line.startsWith(':')) {
                continue;
            }
            const colonIndex = line.indexOf(':');
            const field = colonIndex === -1 ? line : line.slice(0, colonIndex);
            let value = colonIndex === -1 ? '' : line.slice(colonIndex + 1);
            if (value.startsWith(' ')) {
                value = value.slice(1);
            }

            if (field === 'id') {
                event.id = value;
            } else if (field === 'event') {
                event.event = value;
            } else if (field === 'data') {
                dataLines.push(value);
            }
        }

        if (dataLines.length === 0 && event.id === undefined && event.event === undefined) {
            return null;
        }
        event.data = dataLines.join('\n');
        return event;
    }
}
