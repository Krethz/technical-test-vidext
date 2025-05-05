# Vidext prueba técnica

Aplicación que permite crear, modificar y eliminar documentos TlDraw

## Requisitos

- Node.js >= 18
- pnpm / npm / yarn

## Instalación y ejecución

1. Clona el repositorio:

```bash
git clone https://github.com/Krethz/technical-test-vidext.git
cd technical-test-vidext
npm install
```
Después crearemos en la raíz del proyecto el archivo .env en el cual necesitaremos especificar una variable de entorno llamada AZURE_AI_API_KEY=xxxx para que la implementación de openai no de problemas.

Lanzamos el proyecto:

```bash
npm run dev
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

Los archivos que guardan la info de los documentos se crean dentro del directorio "snapshots" en la raíz del proyecto.

La feature de IA no la he podido desarrollarla del todo debido a diversos problemas con la integración de Azure.
El archivo src/server/api/routers/describe.ts contiene la lógica principal de la IA.
En el caso de que fuera funcional, habría que asegurarse de que las claves API estén activas y de tener cuota disponible.
También se debe crear un deployment funcional.
