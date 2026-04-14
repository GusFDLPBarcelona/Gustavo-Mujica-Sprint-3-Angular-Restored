# FEATURES

Registro de funcionalidades y correcciones implementadas en el proyecto, ordenadas de más reciente a más antigua.

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
