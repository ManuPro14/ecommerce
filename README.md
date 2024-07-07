# Mi Tienda Ecommerce

## Descripción
Este proyecto es una plataforma de comercio electrónico desarrollada con Node.js para el backend y Svelte para el frontend. Permite a los usuarios ver productos, agregarlos al carrito y realizar compras, mientras que los administradores pueden gestionar productos e inventario.

## Características
- Catálogo de productos
- Carrito de compras
- Panel de administración
- Gestión de inventario
- API RESTful
- Documentación de API con Swagger

## Tecnologías Utilizadas
- Backend: Node.js, Express.js, MongoDB
- Frontend: Svelte
- Documentación API: Swagger
- Estilizado: Tailwind CSS

## Requisitos Previos
- Node.js (v14 o superior)
- MongoDB
- npm o yarn

## Instalación

### Backend
1. Clona el repositorio:
    git clone https://github.com/tu-usuario/ecommerce.git
    cd mi-tienda-ecommerce/backend
2. Instala las dependencias:
   npm install
3. Crea un archivo `.env` en la raíz del proyecto backend y agrega:
   MONGODB_URI=tu_uri_de_mongodb
   PORT=5000
4. Inicia el servidor:
   node server.ts
El servidor estará corriendo en `http://localhost:5000`.

![image](https://github.com/ManuPro14/ecommerce/assets/103762387/7b8a54da-60f2-4021-a415-bff318690b0c)


### Frontend
1. Navega a la carpeta del frontend:
   cd /ecommerce
2. Instala las dependencias:
   npm install
3. Inicia la aplicación de Svelte:
   npm run dev
  La aplicación estará disponible en `http://localhost:5173`.

## Uso
- Accede a la aplicación web a través de `http://localhost:5173`
- La documentación de la API está disponible en `http://localhost:5000/api-docs`

## Estructura del Proyecto
  ecommerce/
  │
  ├── backend/
  │   ├── server.js
  │   ├── routes/
  │   ├── models/
  │   └── ...
  │
  └── frontend/
  ├── src/
  │   ├── components/
  │   ├── pages/
  │   ├── stores/
  │   └── App.svelte
  └── ...

## API Endpoints

- `GET /api/products`: Obtiene todos los productos
- `POST /api/products`: Crea un nuevo producto
- `PUT /api/products/:id`: Actualiza un producto existente
- `DELETE /api/products/:id`: Elimina un producto
- `GET /api/sales`: Obtiene todas las ventas
- `POST /api/sales`: Registra una nueva venta

Para más detalles, consulta la documentación de Swagger en `http://localhost:5000/api-docs`.


## Contacto
ManuPro14 - manuelcar96@outlook.com

Enlace del proyecto: 
