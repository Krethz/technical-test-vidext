# Vidext prueba técnica

Aplicación que permite crear, modificar y eliminar documentos TlDraw

## Requisitos

- Node.js >= 18
- pnpm / npm / yarn
- Cuenta en Azure OpenAI (con claves de API activas)

## Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/Krethz/test-vidext.git
cd test-vidext
```

## Uso de la aplicación

Al iniciar la aplicación veremos una pantalla en la que podremos crer documentos nuevos si no existen ya.
Al crear un documento nos pedirá el nombre y al introducirlo nos aparecerá el Tldraw para poder empezar a dibujar. Con el botón "Save" podremos guardar el dibujo.
Si volvemos a la home, veremos que nos aparece el documento creado con algo de información, su nombre (el cual podemos editar), la fecha de creación y última modificación. Podremos editar el dibujo y borrarlo.
El botón de AI dentro de Tldraw no funciona.

## Tecnologías usadas

Next.js
Tldraw
tRPC
Tailwind CSS
Azure OpenAI

## Notas

La feature de IA no he podido desarrollarla del todo
El archivo src/server/api/routers/describe.ts contiene la lógica principal de la IA.
En el caso de que fuera funcional, habría que asegurarse de que las claves API estén activas y de tener cuota disponible.
También se debe crear un deployment funcional.
