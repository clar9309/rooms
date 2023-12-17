export interface City {
  id: number;
  name: string;
  state?: string;
  country: string;
  coord: {
    lon: number;
    lat: number;
  };
}

export interface LocationFormType {
  id: number;
  latitude: number;
  longitude: number;
  country: string;
  city: string;
  state?: string;
  roomId: string;
}
