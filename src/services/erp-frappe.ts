import axios from "axios";

type ErpResourceResponse<T> = {
  data: T;
};

const ERP_BASE_URL = import.meta.env.VITE_ERP_BASE_URL ?? "";
const ERP_API_PATH = import.meta.env.VITE_ERP_API_PATH ?? "/api";
const ERP_TIMEOUT = Number(import.meta.env.VITE_ERP_TIMEOUT ?? 15000);
const ERP_API_KEY = import.meta.env.VITE_ERP_API_KEY;
const ERP_API_SECRET = import.meta.env.VITE_ERP_API_SECRET;

const erpApi = axios.create({
  baseURL: `${ERP_BASE_URL}${ERP_API_PATH}`,
  timeout: ERP_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    ...(ERP_API_KEY && ERP_API_SECRET
      ? { Authorization: `token ${ERP_API_KEY}:${ERP_API_SECRET}` }
      : {}),
  },
});

const handleErpError = (context: string, error: unknown) => {
  console.error(`[ERP] ${context} failed`, error);
  throw error;
};

const isNotFoundError = (error: unknown): boolean => {
  return axios.isAxiosError(error) && error.response?.status === 404;
};

export type BackendSetupReport = {
  ok: boolean;
  issues: string[];
  warnings: string[];
  details: {
    baseUrl: string;
    apiPath: string;
    authConfigured: boolean;
    connectionOk: boolean;
    roomDoctype: string | null;
    bookingDoctype: string | null;
  };
};

export const getResource = async <T = unknown>(
  doctype: string,
  filters?: unknown,
  fields?: string[]
): Promise<T[]> => {
  try {
    const response = await erpApi.get<ErpResourceResponse<T[]>>(
      `/resource/${encodeURIComponent(doctype)}`,
      {
        params: {
          filters: filters ? JSON.stringify(filters) : undefined,
          fields: fields ? JSON.stringify(fields) : undefined,
        },
      }
    );

    return response.data.data;
  } catch (error) {
    handleErpError("Fetch resource", error);
  }
};

export const createResource = async <T = unknown>(
  doctype: string,
  data: unknown
): Promise<T> => {
  try {
    const response = await erpApi.post<ErpResourceResponse<T>>(
      `/resource/${encodeURIComponent(doctype)}`,
      data
    );
    return response.data.data;
  } catch (error) {
    handleErpError("Create resource", error);
  }
};

export const updateResource = async <T = unknown>(
  doctype: string,
  name: string,
  data: unknown
): Promise<T> => {
  try {
    const response = await erpApi.put<ErpResourceResponse<T>>(
      `/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`,
      data
    );
    return response.data.data;
  } catch (error) {
    handleErpError("Update resource", error);
  }
};

export const deleteResource = async (doctype: string, name: string): Promise<boolean> => {
  try {
    await erpApi.delete(
      `/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`
    );
    return true;
  } catch (error) {
    handleErpError("Delete resource", error);
  }
};

export const getResourceFromAnyDoctype = async <T = unknown>(
  doctypes: string[],
  filters?: unknown,
  fields?: string[]
): Promise<{ doctype: string; data: T[] }> => {
  let lastError: unknown;

  for (const doctype of doctypes) {
    try {
      const data = await getResource<T>(doctype, filters, fields);
      return { doctype, data };
    } catch (error) {
      lastError = error;
      if (isNotFoundError(error)) {
        continue;
      }
      throw error;
    }
  }

  throw lastError ?? new Error(`None of these doctypes were found: ${doctypes.join(", ")}`);
};

export const checkHotelBackendSetup = async (): Promise<BackendSetupReport> => {
  const issues: string[] = [];
  const warnings: string[] = [];

  const details: BackendSetupReport["details"] = {
    baseUrl: ERP_BASE_URL || "(empty)",
    apiPath: ERP_API_PATH,
    authConfigured: Boolean(ERP_API_KEY && ERP_API_SECRET),
    connectionOk: false,
    roomDoctype: null,
    bookingDoctype: null,
  };

  const usesLocalProxyPath = ERP_API_PATH.startsWith("/erp") || ERP_API_PATH.startsWith("/api");
  if (!ERP_BASE_URL && !usesLocalProxyPath) {
    warnings.push("VITE_ERP_BASE_URL is empty and API path is not a known local proxy path (/erp or /api).");
  }

  let authFailed = false;
  try {
    await getResource<{ name: string }>("User", undefined, ["name"]);
    details.connectionOk = true;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 401 || status === 403) {
        authFailed = true;
        issues.push("ERP connection reached, but authentication failed (401/403).");
      } else if (status === 404) {
        issues.push("ERP API path is incorrect (404). Check VITE_ERP_BASE_URL and VITE_ERP_API_PATH.");
      } else {
        issues.push(`ERP connection failed (${status ?? "network error"}).`);
      }
    } else {
      issues.push("ERP connection failed due to unexpected error.");
    }
  }

  if (!details.authConfigured && authFailed) {
    warnings.push("ERP API token is not configured. Set VITE_ERP_API_KEY and VITE_ERP_API_SECRET.");
  }

  try {
    const room = await getResourceFromAnyDoctype<{ name: string }>(
      ["Room", "Hotel Room", "Rooms", "Room Master"],
      undefined,
      ["name"]
    );
    details.roomDoctype = room.doctype;
  } catch {
    warnings.push("No room doctype found (Room/Hotel Room/Rooms/Room Master).");
  }

  try {
    const booking = await getResourceFromAnyDoctype<{ name: string }>(
      ["Booking", "Reservation", "Hotel Reservation", "Room Reservation", "Hotel Booking"],
      undefined,
      ["name"]
    );
    details.bookingDoctype = booking.doctype;
  } catch {
    warnings.push("No booking doctype found (Booking/Reservation/Hotel Reservation/Room Reservation/Hotel Booking).");
  }

  return {
    ok: issues.length === 0,
    issues,
    warnings,
    details,
  };
};
