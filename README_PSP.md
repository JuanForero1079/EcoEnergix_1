#  Personal Software Process (PSP) -- Aplicación al Proyecto EcoEnergix

## 1. Introducción

El **Personal Software Process (PSP)** es una metodología diseñada para
mejorar el rendimiento individual de los desarrolladores mediante la
planificación, medición y análisis del proceso personal de desarrollo.\
En este README documentamos la aplicación del PSP dentro del proyecto
**EcoEnergix**, un sistema web para la compra y venta de paneles
solares.



## 2. Objetivos del PSP en el Proyecto

-   Mejorar la **precisión en las estimaciones** de tiempo y esfuerzo.
-   Incrementar la **calidad del código** mediante revisiones y control
    de defectos.
-   Reducir el número de **errores en fases tardías** del proyecto.
-   Promover un flujo de trabajo **más organizado, medible y
    repetible**.
-   Estandarizar el proceso personal para los tres integrantes del
    equipo.



## 3. Fases del Proceso PSP Aplicadas

### **PSP0 -- Registro y Medición**

-   Uso de Clockify para registrar horas trabajadas.\
-   Registro de defectos en GitHub Projects + Issues.\
-   Documentación de tareas y notas técnicas en GitHub.



### **PSP1 -- Planeación**

Incluye: - Estimación inicial de esfuerzo por historia de usuario.\
- Registro de tiempo planeado vs. real.\
- Creación de tareas técnicas y subtareas por sprint.

Herramientas utilizadas: - Excel / Google Sheets (tablas de estimación)\
- GitHub Projects (Kanban)



### **PSP1.1 -- Estimación por Tamaño**

-   Desglose del tamaño del código (componentes, rutas, controladores,
    servicios).\
-   Comparación con módulos similares previamente desarrollados.\
-   Aplicación de PROBE para estimar LOC (líneas de código) y esfuerzo.


### **PSP2 -- Calidad y Defectos**

-   Revisión personal del código antes de cada commit.\
-   Estándares de formato: ESLint + Prettier.\
-   Control de defectos por categoría:
    -   Lógica\
    -   UI/UX\
    -   API\
    -   Base de datos\
    -   Integraciones



### **PSP2.1 -- Prevención y Eliminación de Defectos**

-   Revisión cruzada entre integrantes.\
-   Pruebas manuales en navegador.\
-   Pruebas de integración básicas con Postman.\
-   Correcciones rápidas antes del merge hacia `main`.

##  4. Herramientas Utilizadas

  Tipo                   Herramienta       Propósito

  Time Tracking          Clockify          Registro de horas
  Gestión                GitHub Projects   Kanban del proyecto
  Control de versiones   Git + GitHub      Flujo GitFlow
  Defectos               GitHub Issues     Registro y seguimiento
  Estadísticas           Excel / Sheets    Análisis de tiempo y defectos
  Pruebas                Postman           Validación de API
  Desarrollo             VS Code           Entorno principal



##  5. Flujo de Trabajo PSP en el Proyecto

``` text
Inicio
 ↓
Recibo el requerimiento
 ↓
Analizo y divido tareas
 ↓
Creo rama de desarrollo
 ↓
Diseño estructura del componente
 ↓
Desarrollo (JSX, lógica, estilos)
 ↓
Conexión con API (si aplica)
 ↓
Pruebas funcionales y correcciones
 ↓
Refactorizo y mejoro detalles
 ↓
Realizo commits y push
 ↓
Creo Pull Request
 ↓
Correcciones según feedback
 ↓
Aprobación y merge
 ↓
Entrega final
 ↓
Fin
```


## 6. Métricas Recopiladas

Se registraron los siguientes datos por integrante:

-   Tiempo planeado vs. real por tarea.\
-   Defectos encontrados por etapa.\
-   Retrabajo generado (tiempo dedicado a corregir).\
-   Historias completadas por sprint.

Estas métricas se documentan en una hoja compartida del equipo.


##  7. Análisis de Resultados

El uso del PSP permitió:\
- Reducir retrabajo en un **30%** respecto al Sprint 1.\
- Mejorar la planificación del Sprint 3 con base en datos reales.\
- Detectar la concentración de defectos en integraciones API.\
- Aumentar la precisión de estimaciones en más del **20%**.



## 8. Conclusiones

El PSP permitió estandarizar y mejorar el proceso individual de
desarrollo dentro del proyecto EcoEnergix.\
El equipo logró obtener un flujo más organizado, predecible y con mejor
control de errores.


## 9. Integrantes

-   Emmanuel Piñeros
-   Samuel Castillo 
-   Juan Forero

