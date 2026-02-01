import configuration from "../../content-collections.ts";
import { GetTypeByName } from "@content-collections/core";

export type Legal = GetTypeByName<typeof configuration, "legal">;
export declare const allLegals: Array<Legal>;

export {};
