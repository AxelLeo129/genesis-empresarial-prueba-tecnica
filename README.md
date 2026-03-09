# Genesis Empresarial - Prueba Técnica

Sistema financiero básico desarrollado como prueba técnica para Genesis Empresarial.

## Estructura del Proyecto

```
genesis-empresarial-prueba-tecnica/
├── backend/          # API REST con Node.js/Express
├── frontend/         # Aplicación Angular
├── db/              # Scripts de base de datos
│   ├── ddl.sql      # Definición de tablas
│   ├── dml.sql      # Datos de prueba
│   └── diagram.md   # Diagrama ER
└── collection/      # Colección Postman
```

## Tecnologías

### Frontend
- Angular 21
- Tailwind CSS
- Chart.js / ng2-charts
- TypeScript

### Backend
- Node.js
- Express.js
- Sequelize ORM
- MySQL

## Requisitos Previos

- Node.js >= 18
- MySQL >= 8.0
- npm o yarn

## Instalación

### 1. Base de Datos

```sql
-- Crear la base de datos
CREATE DATABASE genesis_financial;

-- Importar esquema
source db/ddl.sql;

-- Importar datos de prueba
source db/dml.sql;
```

### 2. Backend

```bash
cd backend
npm install
```

Configurar variables de entorno en `.env`:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=genesis_financial
DB_USER=root
DB_PASSWORD=tu_contraseña
CORS_ORIGIN=http://localhost:4200
```

Iniciar servidor:
```bash
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
ng serve
```

La aplicación estará disponible en `http://localhost:4200`

## API Endpoints

### Dashboard
- `GET /api/dashboard/home` - Datos para página de inicio
- `GET /api/dashboard/accounts` - Datos para página de cuentas

### Clientes
- `GET /api/clients` - Listar clientes
- `GET /api/clients/:id` - Obtener cliente
- `POST /api/clients` - Crear cliente
- `PUT /api/clients/:id` - Actualizar cliente
- `DELETE /api/clients/:id` - Eliminar cliente

### Cuentas
- `GET /api/accounts` - Listar cuentas
- `GET /api/accounts/:id` - Obtener cuenta
- `POST /api/accounts` - Crear cuenta
- `PUT /api/accounts/:id` - Actualizar cuenta
- `DELETE /api/accounts/:id` - Eliminar cuenta

### Transacciones
- `GET /api/transactions` - Listar transacciones
- `GET /api/transactions/:id` - Obtener transacción
- `POST /api/transactions` - Crear transacción
- `GET /api/transactions/weekly-activity` - Actividad semanal
- `GET /api/transactions/expenses-by-category` - Gastos por categoría
- `GET /api/transactions/balance-history` - Historial de saldo

### External API (Parte 2)
- `GET /api/external/merged-data` - Datos combinados de usuarios y todos
- `GET /api/external/users` - Usuarios de JSONPlaceholder
- `GET /api/external/todos` - Todos de JSONPlaceholder

## Funcionalidades

### Parte 1 - Frontend
- ✅ Página de Inicio con dashboard
- ✅ Visualización de tarjetas
- ✅ Transacciones recientes
- ✅ Gráficos de actividad semanal
- ✅ Estadísticas de gastos (pie chart)
- ✅ Historial de saldo (line chart)
- ✅ Transferencia rápida con contactos
- ✅ Página de Cuentas con resumen
- ✅ Tabla de transacciones
- ✅ Resumen de crédito/débito
- ✅ Pagos programados
- ✅ Formulario de registro de cuenta
- ✅ Validación de formularios
- ✅ Diseño responsive
- ✅ Navegación entre páginas

### Parte 2 - Backend
- ✅ Integración con JSONPlaceholder
- ✅ Endpoint `/api/external/merged-data`
- ✅ Combinación de usuarios y todos
- ✅ Formato de respuesta especificado

## Estructura de Respuesta (Parte 2)

```json
[
  {
    "user": "Leanne Graham",
    "email": "Sincere@april.biz",
    "id": 1,
    "title": "delectus aut autem",
    "completed": false
  },
  ...
]
```

## Autor

Desarrollado para Genesis Empresarial - Prueba Técnica

## Licencia

MIT
