// src/domiciliario/layout/DomiciliarioLayout.jsx
import React, { useState } from "react";
import SidebarDomiciliario from "../componentes/SidebarDomiciliario";
import { Outlet } from "react-router-dom";

export default function DomiciliarioLayout() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-x-hidden overflow-y-auto">
      <SidebarDomiciliario
        isOpen={isOpen}
        toggle={() => setIsOpen(!isOpen)}
      />

      <div className="flex-1 p-10 overflow-auto bg-gradient-to-br from-gray-900 to-gray-800">
        <Outlet />
      </div>
    </div>
  );
}
