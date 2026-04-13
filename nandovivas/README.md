# Nando Vivas — Portfolio

Portfolio web de **Nando Vivas**, diseñador gráfico con base en Barcelona.  
Desarrollado como proyecto final de estudios en desarrollo web con Angular.

Sitio en producción: [nandovivas.com](https://nandovivas.com)

---

## Stack técnico

- **Angular 18** — framework principal, con componentes standalone y signals
- **Firebase Firestore** — base de datos en tiempo real para proyectos y galería
- **Firebase Storage** — almacenamiento de imágenes
- **Firebase Hosting** — despliegue y CDN
- **Firebase Auth** — autenticación del panel de administración
- **Firebase Functions** — backend para el formulario de contacto (envío de email vía Gmail)

---

## Arrancar en local

```bash
npm install
npx @angular/cli@18 serve --port 4200
```

Requiere los archivos de entorno con las credenciales Firebase (no incluidos en el repositorio):
- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`

## Build y deploy

```bash
# Build de producción
npx @angular/cli@18 build --configuration production

# Deploy solo hosting
firebase deploy --only hosting
```

---

## Funcionalidades

### URLs legibles para proyectos (slugs)

Antes, cada proyecto tenía una URL con un identificador generado automáticamente por la base de datos, del tipo `/project-detail/xK92mNpQr`. Ese ID no comunica nada ni al visitante ni a los buscadores.

Ahora cada proyecto tiene un **slug**: una versión del título transformada en URL legible. Por ejemplo, un proyecto llamado "Coca-Cola Brand" genera la URL `/project-detail/coca-cola-brand`. El slug se genera automáticamente al crear o editar un proyecto desde el panel de administración, se puede editar manualmente, y el sistema avisa si ya existe otro proyecto con el mismo slug.

Esto mejora el SEO (los buscadores entienden mejor de qué trata la página) y hace los enlaces más fáciles de compartir y recordar.

---

## Panel de administración

Accesible en `/haupstadt` (ruta no indexada). Requiere autenticación con email y contraseña.  
Permite gestionar los proyectos del portfolio y la galería de la página de inicio sin tocar código.

---

## Autor

Desarrollado por **Gustavo Mujica**  
Proyecto final — curso de desarrollo web con Angular
