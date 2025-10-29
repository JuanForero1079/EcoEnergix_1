// src/admin/services/usersServiceAdmin.js
const STORAGE_KEY = "eco_users_v1";

const SAMPLE = [
  { id: 1, name: "Johan Castillo", email: "johan@gmail.com", role: "Administrador" },
  { id: 2, name: "Emmanuel Piñeros", email: "emmanuel@gmail.com", role: "Administrador" },
  { id: 3, name: "Juan Jose Forero", email: "jujofoca@gmail.com", role: "Administrador" },
];

// Obtener usuarios
export function getUsers() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE));
    return [...SAMPLE];
  }
  try {
    return JSON.parse(raw);
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE));
    return [...SAMPLE];
  }
}

// Crear nuevo usuario
export function createUser(payload) {
  const list = getUsers();
  const newUser = { ...payload, id: Date.now() };
  list.push(newUser);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return newUser;
}

// Actualizar usuario existente
export function updateUser(id, updatedData) {
  const list = getUsers().map((u) => (u.id === id ? { ...u, ...updatedData } : u));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return list.find((u) => u.id === id);
}

// Eliminar usuario
export function deleteUser(id) {
  const list = getUsers().filter((u) => u.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return list;
}
