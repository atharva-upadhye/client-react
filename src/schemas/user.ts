import { z } from "zod";

const geoSchema = z.object({
  lat: z.string(),
  lng: z.string(),
});

const addressSchema = z.object({
  city: z.string(),
  geo: geoSchema,
  street: z.string(),
  suite: z.string(),
  zipcode: z.string(),
});

const companySchema = z.object({
  bs: z.string(),
  catchPhrase: z.string(),
  name: z.string(),
});

export const userSchema = z.object({
  address: addressSchema,
  company: companySchema,
  email: z.email(),
  id: z.number(),
  name: z.string(),
  phone: z.string(),
  username: z.string(),
  website: z.string(),
});
