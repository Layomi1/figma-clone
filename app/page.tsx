"use client";
import { fabric } from "fabric";

import { useEffect, useRef, useState } from "react";
import LeftSidebar from "./components/LeftSidebar";
import Live from "./components/Live";
import Navbar from "./components/Navbar";
import RightSidebar from "./components/RightSidebar";

import {
  handleCanvasMouseDown,
  handleResize,
  initializeFabric,
} from "@/lib/canvas";
import { ActiveElement } from "@/types/type";

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const isDrawing = useRef(false);
  const shapeRef = useRef<fabric.Object | null>(null);
  const selectedShapeRef = useRef<string | null>("rectangle");

  const [activeElement, setActiveElement] = useState<ActiveElement>({
    name: "",
    value: "",
    icon: "",
  });

  const handleActiveElement = (elem: ActiveElement) => {
    setActiveElement(elem);

    selectedShapeRef.current = elem?.value as string;
  };

  const handleImageUpload = () => {};

  const handleWindowResize = () => {
    handleResize({ canvas: fabricRef.current });
  };
  useEffect(() => {
    const canvas = initializeFabric({ canvasRef, fabricRef });

    canvas.on("mouse:down", (options) => {
      handleCanvasMouseDown({
        options,
        canvas,
        isDrawing,
        shapeRef,
        selectedShapeRef,
      });
    });
    window.addEventListener("resize", handleWindowResize);

    return window.removeEventListener("resize", handleWindowResize);
  }, []);

  return (
    <main className="h-screen overflow-hidden">
      <Navbar
        activeElement={activeElement}
        // imageInputRef={undefined}
        handleImageUpload={handleImageUpload}
        handleActiveElement={handleActiveElement}
      />
      <section className="flex h-full flex-row">
        <LeftSidebar allShapes={[]} />

        <Live canvasRef={canvasRef} />
        <RightSidebar />
      </section>
    </main>
  );
}
