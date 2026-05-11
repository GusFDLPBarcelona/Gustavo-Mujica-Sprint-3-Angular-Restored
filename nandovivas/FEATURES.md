# FEATURES

Registro de funcionalidades y correcciones implementadas en el proyecto, ordenadas de más reciente a más antigua.

---

## 2026-05-11

### Perf: optimización del bundle inicial

**Qué se hizo:**
- Eliminado `@angular/material/prebuilt-themes/azure-blue.css` de `angular.json` (build y test): el tema no aportaba nada visual porque `styles.css` sobreescribe todos los estilos de Material con `!important`
- Eliminados de `app.config.ts` los módulos globales no utilizados: `MatFormFieldModule`, `MatInputModule`, `MatButtonModule`
- Budget de Angular subido de 512 kB a 1.2 MB warning / 2 MB error (el SDK de Firebase ocupa ~600 kB en el bundle inicial, es el límite real de lo que se puede reducir sin reestructurar la app)

**Resultado:** CSS inicial 89.96 kB → 18.98 kB (−71 kB). Bundle total 1.01 MB → 937 kB. Transferencia gzipped: 247 kB → 240 kB. Sin advertencias en el build.

---

## 2026-05-05

### Shop — Fase 1.1: modelo de datos y servicio Firestore

**Qué se hizo:**
- Nueva interface `Product` para Firestore con variantes de tallas/colores, slugs y campo `active`
- Interfaces auxiliares: `ProductSize`, `ProductColor`, `CartItem`, `ShopSettings`
- `ProductsService` reescrito con Firestore: CRUD completo + slugs (`generateSlug`, `checkSlugExists`, `getProductBySlug`) + gestión de `settings/shop`
- `ProductResolver` actualizado: busca por slug primero, fallback a ID (compatibilidad)
- Ruta pública `/product-detail/:id` → `/product-detail/:slug`
- Stubs mínimos en `ShopComponent` y `ProductDetailComponent` para compilación limpia (se reescriben en Fase 2)

**Por qué:** La capa de datos es el prerequisito para el admin CRUD de la tienda (Fases 1.3–1.5).

### Shop — Fase 1.2: reglas Firestore para products y settings

**Qué se hizo:** Añadidas reglas en Firebase Console para las colecciones `products` y `settings`: lectura pública, escritura solo autenticada. Misma política que `gallery` y `projects`.

### Shop — Fase 1.5: ShopFormComponent (admin formulario de producto)

**Qué se hizo:**
- 3 columnas: imágenes (portada + galería), datos básicos (nombre, slug, descripción rich text, precio, categoría desde Firestore, altText, orden, active), variantes + acciones
- 4 casos de variantes: sin variantes (stock total) / solo tallas / solo colores / tallas × colores
- Cada color tiene su propia imagen, stock o tallas anidadas
- Slug auto-generado desde nombre, editable, validación async 500ms (igual que Work)
- Eliminar producto con confirmación inline
- Modo creación y edición (carga producto existente por ID)

### Shop — Fase 1.4: ShopListComponent (admin lista de productos)

**Qué se hizo:**
- Grid de tarjetas con imagen, nombre, precio, categoría y badge Activo/Inactivo
- Ordenado por campo `order`
- Editar / Eliminar con confirmación inline (mismo patrón que Work)
- Sección de categorías al pie: chips con × para eliminar + input para añadir — persiste en `settings/shop` de Firestore

### Shop — Fase 1.3: rutas admin y sidebar

**Qué se hizo:**
- Nuevas rutas en `haupstadt.routes.ts`: `/haupstadt/shop`, `/haupstadt/shop/new`, `/haupstadt/shop/:id`
- Sidebar activado: link "Shop" pasa de deshabilitado a activo con `routerLinkActive`
- Stubs `ShopListComponent` y `ShopFormComponent` creados (se implementan en Fases 1.4 y 1.5)

---

## 2026-04-14

### Fix: scroll al filtrar y al volver desde un proyecto (Android producción)

**Qué estaba roto:** En teléfonos Android en producción, al seleccionar un filtro de categoría la lista se reordenaba pero la página no hacía scroll para mostrar el inicio del grid. Lo mismo al pulsar "volver" desde el detalle de un proyecto: el filtro se restauraba pero la posición de scroll no cambiaba.

**Por qué fallaba:**
- Al restaurar el filtro al volver (vía `?category=` en la URL), el scroll se programaba antes de que los proyectos cargasen desde Firestore. El grid estaba vacío en ese momento, así que el scroll no tenía a dónde ir.
- El mecanismo de scroll (`scrollIntoView` + `scrollMarginTop`) tiene comportamiento inconsistente en Chrome Android en modo producción (AOT).

**Cómo se corrigió:**
- La restauración del filtro se mueve al interior de la carga de proyectos, garantizando que el grid ya tiene contenido cuando se ejecuta el scroll.
- `afterNextRender` (hook interno de Angular) se reemplaza por `setTimeout(150ms)` para disparar el scroll. En Chrome Android, `afterNextRender` puede ignorarse en builds de producción (AOT); el timeout da tiempo suficiente para que Angular renderice Y para superar el periodo en que el navegador ignora scroll programático tras un toque.

---

### Restaurar filtro activo al volver desde el detalle de un proyecto

**Qué hace:** Cuando el usuario navega desde la lista de trabajo hacia el detalle de un proyecto y luego vuelve atrás, la categoría que tenía seleccionada se restaura automáticamente.

**Por qué se hizo:** Sin esto, al volver siempre aparecía el filtro "All" independientemente de dónde venía el usuario, interrumpiendo el flujo de navegación.

**Cómo funciona:** Al hacer clic en un proyecto se guarda el filtro activo en `sessionStorage`. El detalle del proyecto lo lee y lo incluye en el enlace de vuelta como parámetro de URL (`?category=`). La lista de trabajo recupera ese parámetro al cargar.
