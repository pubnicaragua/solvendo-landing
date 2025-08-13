import React from "react";

export default function PoliticaPrivacidad() {
  return (
    <div className="container mx-auto py-10 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Política de Privacidad</h1>
      <p className="mb-4">Solvendo SpA – RUT 78.168.951-3<br />Última actualización: 31-07-2025</p>
      <ol className="list-decimal pl-6 space-y-4">
        <li>
          <strong>Responsable del Tratamiento</strong><br />
          Solvendo SpA, domiciliado en Apoquindo 6410, Las Condes, Santiago, es responsable del tratamiento de los datos personales conforme a la Ley N° 19.628 sobre Protección de la Vida Privada.
        </li>
        <li>
          <strong>Datos Recopilados</strong><br />
          Podemos recopilar los siguientes datos:
          <ul className="list-disc pl-6">
            <li>Datos de contacto: nombre, correo, teléfono</li>
            <li>Información comercial: nombre del negocio, rubro, ventas</li>
            <li>Datos de uso del sistema (ventas, inventario, asistencia)</li>
            <li>Dirección IP y datos técnicos para fines de seguridad y mejoras</li>
          </ul>
        </li>
        <li>
          <strong>Finalidad del Tratamiento</strong><br />
          Los datos serán utilizados para:
          <ul className="list-disc pl-6">
            <li>Proveer el Servicio contratado</li>
            <li>Brindar soporte técnico y atención al cliente</li>
            <li>Enviar notificaciones relevantes (técnicas, comerciales o promocionales)</li>
            <li>Mejorar continuamente la plataforma</li>
            <li>Cumplir con obligaciones legales o regulatorias</li>
          </ul>
        </li>
        <li>
          <strong>Conservación de Datos</strong><br />
          Los datos serán conservados mientras el usuario mantenga una cuenta activa y por un máximo de 5 años después del término del servicio, salvo obligación legal de conservarlos por más tiempo.
        </li>
        <li>
          <strong>Transferencia a Terceros</strong><br />
          No compartimos datos personales con terceros, salvo:
          <ul className="list-disc pl-6">
            <li>Proveedores de servicios tecnológicos necesarios para operar el sistema (hosting, email, etc.)</li>
            <li>En cumplimiento de obligaciones legales ante autoridades competentes</li>
          </ul>
          Todos los terceros están sujetos a obligaciones de confidencialidad.
        </li>
        <li>
          <strong>Derechos del Usuario</strong><br />
          Conforme a la Ley 19.628, los usuarios tienen derecho a:
          <ul className="list-disc pl-6">
            <li>Acceder a sus datos</li>
            <li>Solicitar rectificación o eliminación</li>
            <li>Oponerse al tratamiento para fines específicos</li>
            <li>Revocar su consentimiento</li>
          </ul>
          Para ejercer estos derechos, pueden escribir a contacto@solvendo.cl
        </li>
        <li>
          <strong>Seguridad de los Datos</strong><br />
          Solvendo implementa medidas de seguridad técnicas y administrativas razonables para proteger los datos contra accesos no autorizados, pérdida o uso indebido.
        </li>
        <li>
          <strong>Cambios en la Política</strong><br />
          Nos reservamos el derecho de modificar esta Política. Cualquier cambio será informado al usuario a través de la plataforma o por correo electrónico.
        </li>
      </ol>
    </div>
  );
}
