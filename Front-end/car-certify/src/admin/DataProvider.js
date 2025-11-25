import { fetchUtils } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';

const apiUrl = 'https://car-certify.onrender.com/vehicleInfo';

// HTTP client with JWT
const httpClient = (url, options = {}) => {
  if (!options.headers) options.headers = new Headers({ Accept: 'application/json' });
  const token = localStorage.getItem('token');
  options.headers.set('Authorization', `Bearer ${token}`);
  return fetchUtils.fetchJson(url, options);
};

// Base provider
const baseDataProvider = simpleRestProvider(apiUrl, httpClient);

const dataProvider = {
  ...baseDataProvider,

  getList: async (resource, params) => {
    if (resource === "dashboard") {
      const url = `${apiUrl}/dashboard`;
      const { json } = await httpClient(url);
      return { data: json.data, total: json.data.length };
    }

    // Default vehicle logic
    const url = `${apiUrl}/${resource}`; // e.g., /vehicleInfo/vehicles
    const { json } = await httpClient(url);

    // Clean Mongoose objects
    const cleaned = json.data.map(v => {
      const { _doc, __v, ...rest } = v; // remove internal fields
      return {
        ...rest,
        mileageReports: (v.mileageReports || []).map(m => ({ ...m })),
        accidentReports: (v.accidentReports || []).map(a => ({ ...a })),
      };
    });

    return { data: cleaned, total: json.total };
  },

  getOne: async (resource, params) => {
    const url = `${apiUrl}/${resource}/${params.id}`;
    const { json } = await httpClient(url);
    const { _doc, __v, ...rest } = json.data;
    return { data: { ...rest } };
  },

  // add other methods (create, update, delete) if needed
};

export default dataProvider;
