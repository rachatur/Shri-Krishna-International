import axios from "axios";
import { createResource, getResource } from "@/services/erp-frappe";

type GenericRecord = Record<string, unknown>;

const isNotFoundError = (error: unknown): boolean => {
  return axios.isAxiosError(error) && error.response?.status === 404;
};

export const getOrSeedFromAnyDoctype = async <T extends GenericRecord = GenericRecord>(
  doctypes: string[],
  seedData: GenericRecord[] = [],
  fields?: string[]
): Promise<{ doctype: string; data: T[] }> => {
  let lastError: unknown;
  const requestedFields = fields ?? ["*"];

  for (const doctype of doctypes) {
    try {
      const existing = await getResource<T>(doctype, undefined, requestedFields);
      if (existing.length > 0 || seedData.length === 0) {
        return { doctype, data: existing };
      }

      const created: T[] = [];
      for (const row of seedData) {
        try {
          const item = await createResource<T>(doctype, row);
          created.push(item);
        } catch (createError) {
          lastError = createError;
        }
      }

      if (created.length > 0) {
        return { doctype, data: created };
      }

      const refreshed = await getResource<T>(doctype, undefined, requestedFields);
      return { doctype, data: refreshed };
    } catch (error) {
      lastError = error;
      if (isNotFoundError(error)) {
        continue;
      }
      throw error;
    }
  }

  // If ERP access fails, keep the UI usable with local seed rows.
  if (seedData.length > 0) {
    return { doctype: "local-seed", data: seedData as T[] };
  }

  throw lastError ?? new Error(`None of these doctypes were found: ${doctypes.join(", ")}`);
};
