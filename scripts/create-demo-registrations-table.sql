CREATE TABLE demo_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL, -- ¡IMPORTANTE: En una aplicación real, las contraseñas deben ser hasheadas antes de almacenarse!
  rut TEXT,
  razon_social TEXT,
  direccion TEXT,
  region TEXT,
  comuna TEXT,
  business_type TEXT,
  apps TEXT[], -- Array de texto para las aplicaciones seleccionadas
  employees TEXT,
  branches INTEGER,
  total_boxes INTEGER,
  dte TEXT,
  sku_count TEXT,
  offline_mode TEXT
);
