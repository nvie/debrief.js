// @flow

// Two spaces of indentation
export const INDENT = '  ';

export function isMultiline(s: string): boolean {
    const linecount = s.split('\n').length;
    return linecount > 1;
}

export function indent(s: string, prefix: string = INDENT): string {
    if (isMultiline(s)) {
        return s
            .split('\n')
            .map(line => prefix + line)
            .join('\n');
    } else {
        return prefix + s;
    }
}
