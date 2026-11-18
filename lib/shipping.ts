import { z } from 'zod';

export const postalCode = z.string().trim().regex(/^\d{5}-?\d{3}$/, 'Digite um CEP com 8 números.');
