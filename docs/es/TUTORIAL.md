# Tutorial

[English](../en/TUTORIAL.md) · [Türkçe](../tr/TUTORIAL.md) · [Deutsch](../de/TUTORIAL.md) · [Español](../es/TUTORIAL.md) · [繁體中文](../zh/TUTORIAL.md)

Esta página recorre las cuatro cosas para las que la gente usa realmente SteamEdge. Da por
hecho que ya has iniciado sesión; si no, empieza por la [Instalación](./SETUP.md).

---

## 1. Farmea tus primeros cromos

Pestaña **Farmeo de cromos**.

1. Pulsa **Actualizar lista de juegos**. SteamEdge lee tus páginas de insignias de Steam y
   lista todos los juegos a los que aún les quedan cromos.
2. Elige un **modo de farmeo** (explicado abajo).
3. Pulsa **Iniciar**.

Ya está. Deja la ventana abierta, o minimízala a la bandeja si lo activaste en los ajustes.
Los cromos aparecen en **Últimas obtenciones** conforme llegan.

### ¿Qué modo debo usar?

| Modo | Qué hace | Cuándo usarlo |
|---|---|---|
| **Secuencial** | Un juego cada vez, en el orden de la cola. | Quieres un comportamiento simple y predecible. |
| **Más cromos** | Primero los juegos con más cromos pendientes. | Quieres el mayor número de cromos cuanto antes. |
| **Menos cromos** | Primero los que menos cromos tienen pendientes. | Quieres *completar* insignias rápido. |
| **Prioridad** | Tu orden manual, con las flechas de cada fila. | Te importan juegos concretos primero. |
| **Rápido** | Mira abajo. | Tienes juegos con menos de 2 horas de juego. |

### Sobre el modo Rápido

Steam solo suelta cromos de un juego cuando su **tiempo total supera las 2 horas**. El modo
Rápido lo resuelve en dos etapas:

1. **Calentamiento.** Cada juego seleccionado por debajo de 2 horas se abre *en paralelo* y
   se lleva hasta el umbral. Steam cuenta tiempo para cada juego abierto a la vez, así que
   un lote tarda lo que su miembro más rezagado, no la suma.
2. **Rotación.** Superado el umbral, todos permanecen abiertos y el juego destacado cambia
   cada 1,5-2 minutos (aleatorizado, para que no haya un ritmo fijo).

Cuando pulsas Iniciar en modo Rápido, SteamEdge te dice cuántos juegos necesitan
calentamiento primero.

### Controles de la cola

Cada fila de la cola tiene botones pequeños:

- **↑ / ↓** suben o bajan el juego (esto cambia el modo a Prioridad)
- **Mover al principio** lo envía al frente
- **✕** lo quita de la cola por completo

Tu orden y tus exclusiones se recuerdan entre sesiones. Cuánto tiempo se define en Ajustes →
General → Copia de seguridad → *Cuánto tiempo se guardan los datos recordados*.

---

## 2. Aumenta horas de juego

Pestaña **Impulsor de horas**.

1. Busca en tu biblioteca a la izquierda y haz clic en los juegos para añadirlos a la cola.
2. Fija el **límite simultáneo** (2 / 8 / 16 / 32 o personalizado).
3. Fija la **duración del impulso**, o elige Sin límite.
4. Pulsa **Iniciar**.

Steam cuenta tiempo de juego para cada juego abierto a la vez, hasta un límite conocido de 32.

### Sincronización de horas

Es la función que más se pide. Actívala en Ajustes → Impulsor de horas → **Igualar tiempos
de juego**.

Supón que tienes tres juegos con 8, 11 y 101 horas y quieres igualarlos. SteamEdge lo hace
por etapas:

1. El juego de 8 horas corre solo hasta llegar a 11 horas.
2. Ahora ambos corren juntos hasta llegar a 101 horas.
3. Los tres continúan juntos desde ahí.

Antes de empezar aparece un cuadro de confirmación con cada etapa y el tiempo total
necesario. Ese total puede ser de días: léelo antes de aceptar.

Hay tres objetivos disponibles:

- **El más alto de los seleccionados** - el juego más jugado de tu cola marca la meta
- **Horas introducidas manualmente** - tú escribes el objetivo
- **El más alto de la biblioteca** - el mayor tiempo de toda tu cuenta de Steam

Los juegos que ya superan el objetivo se dejan como están.

---

## 3. Gestiona logros

Pestaña **Logros**.

1. Busca un juego en el selector superior. Solo aparecen los juegos que registran logros.
2. Espera a que cargue la lista: SteamEdge lee el estado real de desbloqueo por protocolo.
3. Haz clic en la casilla de cualquier logro, o usa **Desbloquear seleccionados** /
   **Bloquear seleccionados**.

El panel derecho muestra la descripción, la rareza, la fecha de desbloqueo y qué porcentaje
de jugadores lo tiene.

### Lee esto antes de desbloquear en lote

- El **modo seguro** (activado por defecto) desbloquea de uno en uno, con un intervalo
  aleatorio entre cada uno. Déjalo activado.
- El **intervalo de desbloqueo** es de 1 segundo por defecto. Es la opción más rápida.
  Desbloquear cientos de logros en un par de minutos es visible en tu perfil público y en
  los sitios que siguen el historial de logros.
- **Repartir los desbloqueos en el tiempo** amplía aún más la aleatoriedad: parece más
  natural, pero tarda mucho más.
- Volver a bloquear un logro es posible, pero la fecha original de desbloqueo se pierde para
  siempre.

Cada desbloqueo se escribe en un registro local para que veas qué cambiaste.

---

## 4. Vende objetos en el Mercado

Pestaña **Inventario y Mercado**.

### Obtener precios

Al abrir la pestaña, SteamEdge pregunta si obtener los precios ahora. Steam limita las
peticiones al mercado (unas 20 cada 30 segundos), así que un inventario grande tarda.

La vía más rápida:

1. Responde **No, más tarde**.
2. Configura tus filtros: tipo, juego, estado, rango de precio.
3. Pulsa **Obtener precios** en la barra de herramientas.

Solo se obtienen los objetos que coinciden con el filtro actual. El botón se bloquea y
muestra el progreso hasta que terminan todas las peticiones. Si cambias un filtro, vuelve a
estar disponible para la nueva selección.

### Leer un objeto

Haz clic en cualquier objeto. El panel derecho muestra tres cuadros distintos, y la
diferencia importa:

| Cuadro | Qué significa |
|---|---|
| **Ofertas actuales** | Lo que *piden* los vendedores. No es vinculante: cualquiera puede publicar un objeto a 999.999 $. |
| **Vender al instante** | La orden de compra más alta pendiente. Es lo que consigues ahora mismo, hoy. |
| **Ventas completadas** | A cuánto se vendió realmente. **De aquí sale el valor del objeto.** |

El valor es la mediana ponderada por cantidad de las ventas completadas, no una media. Si se
vendieron 100 unidades a 0,30 $ y una a 50 $, la media dice 0,79 $ y la mediana dice 0,30 $.
La mediana tiene razón.

Si no hay órdenes de compra pendientes, el cuadro **Vender al instante** no se queda en
blanco: recurre a la última venta completada y lo indica explícitamente.

### Vender

Toda la venta se hace desde la barra inferior, tanto si es un objeto como si son cincuenta.

1. Marca los objetos que quieras vender (o haz clic en una fila y usa directamente la barra
   inferior).
2. Elige una estrategia de precio:
   - **Desde la media** - el valor de las ventas completadas. Da más beneficio, vende más
     despacio.
   - **Rebajar** - un paso por debajo de la oferta más barata. Vende más rápido.
   - **Igualar al más bajo** - el mismo precio que la oferta más barata.
   - **Vender al instante** - a la orden de compra más alta. Desaparece de inmediato.
   - **Personalizado** - escribes tu propio precio.
3. Revisa la línea de advertencia. Si algún objeto está más de un 25 % por encima o por
   debajo de su valor real de mercado, SteamEdge te lo dice antes de confirmar.
4. Pulsa **Vender**.

La barra muestra tanto el **precio bruto** (lo que paga el comprador, la cifra que ves en
Steam) como el **precio neto** (lo que llega a tu monedero tras el ~13 % de comisión de
Steam).

> Si tu cuenta tiene autenticador móvil, Steam seguirá pidiéndote aprobar cada publicación
> en la app de Steam. SteamEdge no confirma automáticamente por ti salvo que hayas importado
> un maFile.

---

## Buenas costumbres

- **Mira primero el Resumen.** Muestra qué está en marcha, cuánto lleva la sesión y la
  actividad reciente de todas las funciones.
- **Activa Aparecer sin conexión** (Ajustes → Privacidad) si no quieres que tus amigos te
  vean "jugando" a cuarenta juegos.
- **Usa las horas de silencio** (Ajustes → Notificaciones) para que la app no te avise a las
  3 de la mañana.
- **Exporta tus ajustes** de vez en cuando (Ajustes → General → Copia de seguridad). La
  exportación no contiene datos de inicio de sesión, así que puede ir a la nube.

---

Siguiente: [Ajustes](./INSTRUCTIONS.md) - cada opción explicada.
