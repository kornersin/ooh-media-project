# Refinamientos precisos de interfaz

## Alcance
- Mantener la estructura actual y fijar la aplicación al alto de la ventana, sin desplazamiento del documento.
- Iniciar la barra lateral contraída y conservar su estado al cambiar de módulo o rol.
- Actualizar la barra lateral a fondo claro, borde lavanda y sombra suave; mostrar nombres mediante tooltips cuando esté contraída.
- Mantener la navegación inferior en móvil y abrir hacia arriba los controles ubicados en esa barra.
- Separar visualmente la zona superior fija de filtros y la zona inferior de resultados, permitiendo desplazamiento solo dentro de la lista o tabla.
- Aplicar fondo lavanda y texto gris azulado, semibold y en mayúsculas a los encabezados de ambas tablas.
- Añadir al panel lateral las pestañas Detalles, Ubicación, Fotos, Disponibilidad e Historial, con paneles de marcador visual para las pestañas secundarias.

## Detalles técnicos
- El estado visual compartido de la barra lateral vivirá en el proveedor existente para no reiniciarse durante la navegación ni cambios de rol.
- Se reutilizarán los tokens de color existentes y se añadirá el token lavanda necesario, evitando cambiar reglas de negocio o datos.
- Los contenedores usarán cadenas flexibles con `min-h-0` y `overflow-hidden`; solo el área de resultados tendrá `overflow-auto`.
- Se verificará el resultado en escritorio y en un ancho menor de 768 px, incluyendo navegación, menús ascendentes y pestañas del panel.
