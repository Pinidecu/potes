import axios, { AxiosInstance } from "axios";

// Tipos
type FormType = Record<string, any>;
type RequiredFields = string[];
type SnackbarFn = (
  message: string,
  options?: { variant: "error" | "success" | "info" | "warning" }
) => void;
type Callback<T = any> = (data: T) => void;
type SetLoadingFn = (loading: boolean) => void;

const api: AxiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const petitions: any = {};

// Verificar formulario
export const verifyForm = (
  form: FormType,
  required: RequiredFields,
  enqueueSnackbar: SnackbarFn
): boolean => {
  for (let field of required) {
    if (!form[field]) {
      enqueueSnackbar(`Complete los campos obligatorios`, { variant: "error" });
      return false;
    }
  }
  return true;
};

// Normalizar respuestas (evita: filter/slice/reverse is not a function)
const normalizeResponse = (method: string, payload: any) => {
  // Si el backend ya devuelve un array, perfecto
  if (Array.isArray(payload)) return payload;

  // Normalización por endpoint (ajustado a tus métodos)
  switch (method) {
    case "getOrders":
      return Array.isArray(payload?.orders) ? payload.orders : [];

    case "getSalads":
      return Array.isArray(payload?.salads) ? payload.salads : [];

    case "getIngredients":
    case "getActiveIngredients":
      return Array.isArray(payload?.ingredients) ? payload.ingredients : [];

    // Stats normalmente devuelve objeto, no array
    case "getStats":
      return payload;

    default:
      // Fallbacks comunes por si tu API responde distinto
      if (Array.isArray(payload?.items)) return payload.items;
      if (Array.isArray(payload?.results)) return payload.results;
      if (Array.isArray(payload?.data)) return payload.data;

      return payload;
  }
};

// Hacer consulta
export const makeQuery = async (
  token: string | null,
  method: string,
  form: FormType | string,
  enqueueSnackbar?: SnackbarFn,
  onSuccess?: Callback,
  setLoading?: SetLoadingFn,
  onError?: Callback
): Promise<any> => {
  if (setLoading) setLoading(true);

  try {
    // Authorization header (solo si hay token)
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }

    if (!petitions[method]) {
      throw new Error(`Método no encontrado en petitions: ${method}`);
    }

    const response = await petitions[method](form);

    // Axios response -> response.data es el body
    const raw = response?.data; 

    const normalized = normalizeResponse(method, raw); 

    if (onSuccess) onSuccess(normalized);
    return normalized;
  } catch (error: any) {
    console.error(error);

    const errorMessage =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.message ||
      "Error en el servidor";

    if (enqueueSnackbar) {
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
    if (onError) onError(error);
  } finally {
    if (setLoading) setLoading(false);
  }
};

// * INGREDIENTS
petitions.createIngredient = (form: FormType) => api.post("/ingredients", form);
petitions.getIngredients = () => api.get("/ingredients");
petitions.getActiveIngredients = () => api.get("/ingredients/active");
petitions.getIngredientById = (id: string) => api.get(`/ingredients/${id}`);
petitions.updateIngredient = ({ id, ...form }: any) =>
  api.put(`/ingredients/${id}`, form);
petitions.deleteIngredient = (id: string) => api.delete(`/ingredients/${id}`);

// * SALADS
petitions.createSalad = (form: FormType) =>
  api.post("/salads", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

petitions.getSalads = (filter: { name?: string; type?: string }) =>
  api.get(`/salads`, { params: filter });

petitions.getSaladById = (id: string) => api.get(`/salads/${id}`);

petitions.updateSalad = ({ id, form }: any) =>
  api.put(`/salads/${id}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

petitions.deleteSalad = (id: string) => api.delete(`/salads/${id}`);

// * ORDERS
petitions.createOrder = (form: FormType) => api.post("/orders", form);
petitions.getOrders = () => api.get("/orders");
petitions.getOrderById = (id: string) => api.get(`/orders/${id}`);
petitions.updateOrder = ({ id, ...form }: any) => api.put(`/orders/${id}`, form);
petitions.deleteOrder = (id: string) => api.delete(`/orders/${id}`);

// * STATS
petitions.getStats = () => api.get("/stats/dashboard");

export default petitions;
