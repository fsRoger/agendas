export type Role = "master" | "adminC" | "adminU";
export type AppointmentStatus = "pending" | "confirmed" | "cancelled";

export interface Location {
  id: string;
  slug: string;
  name: string;
}

export interface Service {
  id: string;
  location_id: string;
  category: string;
  name: string;
  price_cents: number;
  active: boolean;
}

export interface Appointment {
  id: string;
  location_id: string;
  service_id: string;
  date: string; // YYYY-MM-DD
  slot_time: string; // HH:MM:SS
  client_name: string;
  client_phone: string;
  deposit_cents: number;
  status: AppointmentStatus;
  created_at: string;
}

export interface AppointmentWithDetails extends Appointment {
  services: { name: string; category: string; price_cents: number } | null;
  locations: { slug: string; name: string } | null;
}
