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
  baseURL: "http://localhost:4000/api",
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
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const { data } = await petitions[method](form);
    console.log("Method:", method, "Data:", data);
    if (onSuccess) onSuccess(data);
    return data;
  } catch (error: any) {
    console.error(error);
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
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
petitions.getIngredientById = (id: string) => api.get(`/ingredients/${id}`);
petitions.updateIngredient = ({ id, ...form }: any) =>
  api.put(`/ingredients/${id}`, form);
petitions.deleteIngredient = (id: string) => api.delete(`/ingredients/${id}`);

// * SALADS
petitions.createSalad = (form: FormType) => api.post("/salads", form, {
  headers: { "Content-Type": "multipart/form-data" },
});
petitions.getSalads = () => api.get("/salads");
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
petitions.updateOrder = ({ id, ...form }: any) =>
  api.put(`/orders/${id}`, form);
petitions.deleteOrder = (id: string) => api.delete(`/orders/${id}`);

// * STATS  
petitions.getStats = () => api.get("/stats/dashboard");

export default petitions;
