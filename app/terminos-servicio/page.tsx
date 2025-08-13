import React from "react";

export default function TerminosServicio() {
  return (
    <div className="container mx-auto py-10 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Términos y Condiciones de Uso</h1>
      <p className="mb-4">Solvendo SpA – RUT 78.168.951-3<br />Última actualización: 31-07-2025</p>
      <ol className="list-decimal pl-6 space-y-4">
        <li>
          <strong>Aceptación de los Términos</strong><br />
          Al acceder y utilizar la plataforma Solvendo (en adelante, "el Servicio"), el usuario acepta expresamente los presentes Términos y Condiciones. Si no está de acuerdo con alguno de ellos, debe abstenerse de utilizar el Servicio.
        </li>
        <li>
          <strong>Descripción del Servicio</strong><br />
          Solvendo es una plataforma de software ERP que permite a pequeños comercios y empresas llevar la gestión de ventas, inventario, asistencia de trabajadores, emisión de boletas y reportes, entre otras funciones.
        </li>
        <li>
          <strong>Registro y Cuenta</strong><br />
          Para utilizar el Servicio, el usuario debe registrarse con información verídica y actualizada. Es responsable de mantener la confidencialidad de su contraseña y de todas las actividades realizadas en su cuenta.
        </li>
        <li>
          <strong>Obligaciones del Usuario</strong><br />
          El usuario se compromete a:
          <ul className="list-disc pl-6">
            <li>Utilizar el Servicio conforme a la ley chilena y a estos Términos.</li>
            <li>No usar el Servicio con fines ilícitos, fraudulentos o maliciosos.</li>
            <li>No interferir con el funcionamiento del Servicio o intentar acceder a funciones restringidas.</li>
          </ul>
        </li>
        <li>
          <strong>Propiedad Intelectual</strong><br />
          Todos los derechos sobre el software, diseño, marca, código fuente y contenidos son propiedad de Solvendo SpA. Está prohibida la copia, modificación, reproducción o distribución sin autorización escrita.
        </li>
        <li>
          <strong>Planes y Pagos</strong><br />
          Solvendo puede ofrecer versiones gratuitas y de pago. En caso de contratar un plan pagado, el usuario acepta los precios, facturación y condiciones vigentes al momento de la contratación.
        </li>
        <li>
          <strong>Limitación de Responsabilidad</strong><br />
          Solvendo no se hace responsable por interrupciones del servicio por causas de fuerza mayor, fallas técnicas ajenas o mal uso por parte del usuario. Tampoco garantiza la exactitud de la información ingresada por terceros.
        </li>
        <li>
          <strong>Modificaciones</strong><br />
          Solvendo se reserva el derecho a modificar estos términos en cualquier momento. El uso continuado del Servicio después de publicadas las modificaciones constituye aceptación de las mismas.
        </li>
        <li>
          <strong>Término del Servicio</strong><br />
          El usuario puede cancelar su cuenta en cualquier momento. Solvendo podrá suspender o eliminar cuentas que incumplan estos términos o la ley vigente.
        </li>
        <li>
          <strong>Legislación Aplicable</strong><br />
          Estos Términos se rigen por la legislación de la República de Chile. Toda controversia será resuelta por los tribunales ordinarios de justicia de Santiago, Región Metropolitana.
        </li>
      </ol>
    </div>
  );
}
