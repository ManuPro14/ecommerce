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

- Backend: Render
- Frontend: Svelte
- Documentación API: Swagger
- Estilizado: Tailwind CSS

## Requisitos Previos

- Node.js (v14 o superior)
- npm o yarn

## Instalación

![image](https://github.com/ManuPro14/ecommerce/assets/103762387/7b8a54da-60f2-4021-a415-bff318690b0c)

### Frontend

1. Navega a la carpeta del frontend:
   cd /ecommerce
2. Instala las dependencias:
   npm install
3. Inicia la aplicación de Svelte:
   npm run dev
4. Usuario del administrador:
   User: AdminCommerce
   Password: EcommerceAdmin

La aplicación estará disponible en `http://localhost:5173`.

## Uso

- Accede a la aplicación web a través de `http://localhost:5173`
- La documentación de la API está disponible en `https://ecommerce-omp9.onrender.com/api-docs`

## Estructura del Proyecto

ecommerce/
│
├── backend/ (se encuentra desplegado en Render)
│ └── server.ts
│
└── frontend/
├── src/
│ ├── components/
│ ├── pages/
│ ├── stores/
│ └── App.svelte

## API Endpoints

- `GET /api/products`: Obtiene todos los productos
- `POST /api/products`: Crea un nuevo producto
- `PUT /api/products/:id`: Actualiza un producto existente
- `DELETE /api/products/:id`: Elimina un producto
- `GET /api/sales`: Obtiene todas las ventas
- `POST /api/sales`: Registra una nueva venta

Para más detalles, consulta la documentación de Swagger en `https://ecommerce-omp9.onrender.com/api-docs`.

## Contacto

ManuPro14 - manuelcar96@outlook.com

Enlace del proyecto: https://ecommerce-one-virid.vercel.app/
