-- Paso 1: Identificar los correos electrónicos duplicados
SELECT email, COUNT(*)
FROM demo_registrations
GROUP BY email
HAVING COUNT(*) > 1;

-- Paso 2: Eliminar las filas duplicadas, manteniendo la más antigua (por id)
-- Esta consulta elimina todas las filas duplicadas excepto la que tiene el ID más bajo (asumiendo que un ID más bajo significa un registro más antiguo).
DELETE FROM demo_registrations
WHERE id IN (
    SELECT id
    FROM (
        SELECT id,
               ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at ASC, id ASC) as rn
        FROM demo_registrations
    ) t
    WHERE t.rn > 1
);
