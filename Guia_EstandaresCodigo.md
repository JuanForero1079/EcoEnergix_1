# Guía de Estándares de Código

Este documento define los estándares de codificación para garantizar un código consistente, legible y mantenible dentro del proyecto.

## 1. Reglas de Nombres

### Variables
- Usar **camelCase** para variables en JavaScript y **snake_case** en Python.
- Nombres descriptivos y significativos.
- Evitar abreviaturas innecesarias.

**Ejemplo Aceptado (JS):**
```javascript
let userName = "Juan";
```

**Ejemplo No Aceptado (JS):**
```javascript
let usn = "Juan";
```

### Clases
- Usar **PascalCase**.
- Nombre debe representar claramente la entidad.

**Ejemplo Aceptado:**
```javascript
class UserProfile {}
```

**Ejemplo No Aceptado:**
```javascript
class userprofile {}
```

### Métodos y Funciones
- Usar **camelCase**.
- El nombre debe describir la acción.

**Ejemplo Aceptado:**
```javascript
function getUserData() {}
```

**Ejemplo No Aceptado:**
```javascript
function gud() {}
```

---

## 2. Comentarios y Documentación Interna

- Usar comentarios para explicar el **por qué** del código, no el **qué**.
- Documentar funciones con parámetros y retornos.
- Evitar comentarios redundantes.

**Ejemplo Aceptado:**
```javascript
// Obtiene los datos del usuario desde la API
function getUserData(userId) {
    return fetch(`/api/users/${userId}`);
}
```

**Ejemplo No Aceptado:**
```javascript
// función getUserData
function getUserData(userId) {
    return fetch(`/api/users/${userId}`);
}
```

---

## 3. Identación y Estilo de Código

- Usar **4 espacios** para indentación.
- Líneas máximo de **100 caracteres**.
- Usar **;** al final de cada instrucción en JavaScript.
- En Python, respetar PEP8 (máximo 79 caracteres por línea).

**Ejemplo Aceptado (JS):**
```javascript
if (isActive) {
    console.log("Activo");
} else {
    console.log("Inactivo");
}
```

**Ejemplo No Aceptado (JS):**
```javascript
if(isActive){
console.log("Activo")
}else{
console.log("Inactivo")
}
```

---

## 4. Ejemplos Aceptados y No Aceptados

### Nombres de Variables
**Si** `let productPrice = 100;`  
**No** `let pp = 100;`

### Funciones
**Si** `function calculateTotal(price, tax) { return price + tax; }`  
**No** `function ct(p, t) { return p + t; }`

### Python Ejemplo
**Si**
```python
def get_user_data(user_id: int) -> dict:
    """Obtiene los datos de un usuario dado su ID."""
    return {"id": user_id, "name": "Juan"}
```
**No**
```python
def gud(x):
    return {"id": x, "name": "Juan"}
```

---

## 5. Herramientas de Formateo y Análisis

### JavaScript / React
- Usar **ESLint** para validar estilo de código.
- Instalar con:
```bash
npm install eslint --save-dev
npx eslint --init
```

### Python
- Usar **Black** como formateador.
- Instalar con:
```bash
pip install black
```

- Ejecutar formateo con:
```bash
black .
```

---

## 6. Aplicación de las Reglas

- El código existente debe ser adaptado a estas normas.
- Todos los **pull requests** deben pasar validación de ESLint o Black.
- Se revisará la consistencia en cada commit.

---

## 7. Buenas Prácticas Generales

- Escribir código limpio y modular.
- Seguir principios **DRY** (Don't Repeat Yourself).
- Revisar el código antes de subirlo al repositorio.
- Nombrar commits de forma descriptiva.

---
 **Este archivo debe mantenerse actualizado conforme el stack del proyecto evolucione.**
