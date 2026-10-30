export type Sample = number | null;
export type Dataset = {samples: Sample[]; invalid: number; ignored: number; lineCount: number; errors: string[]; summaryMismatch: string};
export function parseSample(line: string): Sample | undefined;
export function isLogHeader(line: string): boolean;
export function readDataset(input: string): Dataset;
export function summarize(data: Sample[]): { count:number; received:number; avg:number; p95:number; max:number; maxRun:number; loss:number };
export function assessDataset(samples: Sample[], meta?: {target?:string;timestamp?:string;intervalKnown?:boolean}): {status:string;issues:string[]};
export function comparisonNotes(a: Sample[], b: Sample[]): string[];
