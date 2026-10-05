export const LOCAL_STORAGE_PREFERED_AREA_KEY = `preferedArea`;

export const getPreferedArea = () =>
  localStorage.getItem(LOCAL_STORAGE_PREFERED_AREA_KEY) ?? "";

export const savePreferedArea = (area: string) => {
  localStorage.setItem(LOCAL_STORAGE_PREFERED_AREA_KEY, area.toString());
};
