// ../index.ts
export type inspectorPositionRefType = {
    getNodePositionInfo: (uuid: string) => void,
}

export interface NodeId {
    value: string
}


// ../inspector-position.ts
export interface Point {
    x: number,
    y: number,
    z: number,
}

export enum PositionType {
    X = 'x',
    Y = 'y',
    Z = 'z',
}

export type inputValType = string | number