// @flow

// $FlowFixMe
export default function debrief(o: any) {
    return JSON.stringify(o) || '(unserializable)';
}
