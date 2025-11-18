"use client";
import { fabric } from "fabric";

import { useEffect, useRef, useState } from "react";
import LeftSidebar from "./components/LeftSidebar";
import Live from "./components/Live";
import Navbar from "./components/Navbar";
import RightSidebar from "./components/RightSidebar";

import {
  handleCanvasMouseDown,
  handleCanvasMouseMove,
  handleCanvasMouseUp,
  handleCanvasObjectModified,
  handleResize,
  initializeFabric,
  renderCanvas,
} from "@/lib/canvas";
import { ActiveElement } from "@/types/type";
import { useMutation, useStorage } from "@liveblocks/react";

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const isDrawing = useRef(false);
  const shapeRef = useRef<fabric.Object | null>(null);
  const selectedShapeRef = useRef<string | null>("rectangle");

  const activeObjectRef = useRef<fabric.Object | null>(null);

  const [isStorageLoaded, setIsStorageLoaded] = useState(false);

  const canvasObjects = useStorage((root) => root.canvasObjects);

  const syncShapeInStorage = useMutation(({ storage }, object) => {
    if (!object && !isStorageLoaded) return;

    const { objectId } = object;

    const shapeData = object.toJSON();
    shapeData.objectId = objectId;

    const canvasObjects = storage.get("canvasObjects");
    canvasObjects.set(objectId, shapeData);
  }, []);

  console.log(syncShapeInStorage);
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
    if (canvasObjects === null) {
      setIsStorageLoaded(true);
    }
  }, [canvasObjects]);

  useEffect(() => {
    if (!isStorageLoaded) return;

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

    canvas.on("mouse:move", (options) => {
      handleCanvasMouseMove({
        options,
        canvas,
        isDrawing,
        shapeRef,
        selectedShapeRef,
        syncShapeInStorage,
      });
    });

    canvas.on("mouse:up", () => {
      handleCanvasMouseUp({
        canvas,
        isDrawing,
        shapeRef,
        selectedShapeRef,
        syncShapeInStorage,
        setActiveElement,
        activeObjectRef,
      });
    });

    canvas.on("object:modified", (options) => {
      handleCanvasObjectModified({
        options,
        syncShapeInStorage,
      });
    });

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [syncShapeInStorage, isStorageLoaded]);

  // rendering of canvas when changes are made to reflect on collaborator's screen
  useEffect(() => {
    if (!isStorageLoaded) return;

    renderCanvas({
      fabricRef,
      canvasObjects,
      activeObjectRef,
    });
  }, [canvasObjects, isStorageLoaded]);

  if (!isStorageLoaded) {
    return (
      <main className="h-screen overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-white">Connecting...</p>
        </div>
      </main>
    );
  }

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
