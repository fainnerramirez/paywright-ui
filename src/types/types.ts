
type TNode = {
  id: string,
  position: { x: number; y: number };
  data: { label: string };
}
type TEdge = {
  id: string,
  source: string;
  target: string;
}
type TDataPage = {
  id: number;
  title: string;
  description: string;
};
type TPages = {
  home: TDataPage;
  flights: TDataPage;
  passengers: TDataPage;
  services: TDataPage;
  seats: TDataPage;
  payment: TDataPage;
};

type ResponseAPI = {
  message: string;
  details?: string
};

export type { ResponseAPI, TDataPage, TEdge, TNode, TPages };

