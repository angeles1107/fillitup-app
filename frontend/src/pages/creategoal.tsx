// src/pages/CreateGoalPage.tsx

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, ArrowLeft } from "lucide-react";
// Importa la función 'toast' de 'sonner'
import { toast } from "sonner";

// Obtén las variables de entorno para Cloudinary y la API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export default function CreateGoal() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState<number | "">("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [localImagePreview, setLocalImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Lógica para la carga de imagen a Cloudinary
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 1. Mostrar previsualización local inmediatamente
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // 2. Subir la imagen a Cloudinary
      setIsUploadingImage(true); // Indicar que la imagen se está subiendo
      toast.info("Subiendo imagen...", { id: "upload-image" }); // Notificación de carga

      if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
        console.error("Cloudinary Cloud Name o Upload Preset no están definidos en las variables de entorno.");
        toast.error("Error de configuración: Variables de Cloudinary faltantes.", { id: "upload-image" });
        setIsUploadingImage(false);
        setLocalImagePreview(null);
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Error al subir la imagen a Cloudinary.");
        }

        const data = await response.json();
        setImageUrl(data.secure_url); // Guardar la URL segura de Cloudinary
        console.log("Imagen subida a Cloudinary:", data.secure_url);
        toast.success("Imagen subida con éxito!", { id: "upload-image" }); // Notificación de éxito
      } catch (error) {
        console.error("Error en la subida de imagen:", error);
        toast.error(`Error al subir la imagen: ${error instanceof Error ? error.message : "Error desconocido"}`, { id: "upload-image" }); // Notificación de error
        setLocalImagePreview(null); // Limpiar previsualización si falla
        setImageUrl(null); // Limpiar URL si falla
      } finally {
        setIsUploadingImage(false); // Finalizar la carga de imagen
      }
    }
  };

  // Lógica para remover la imagen
  const removeImage = () => {
    setImageUrl(null);
    setLocalImagePreview(null);
    toast.info("Imagen eliminada."); // Notificación al remover imagen
  };

  // Lógica para enviar el formulario de creación de meta
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || targetAmount === "" || targetAmount <= 0) {
      toast.warning("Por favor, completa todos los campos requeridos y asegúrate de que el monto objetivo sea positivo.");
      return;
    }

    if (!imageUrl && !isUploadingImage) {
      toast.warning("Por favor, sube una imagen para tu meta o espera a que termine la carga.");
      return;
    }

    setIsSubmitting(true);
    toast.loading("Creando tu meta...", { id: "create-goal" }); // Notificación de carga

    try {
      const response = await fetch(`${API_BASE_URL}/goals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          targetAmount: targetAmount,
          imageUrl: imageUrl || undefined, // Enviar la URL de Cloudinary (o undefined si no hay imagen)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error desconocido al crear la meta.");
      }

      const newGoal = await response.json();
      toast.success(`¡Meta "${newGoal.title}" creada con éxito!`, { id: "create-goal" }); // Notificación de éxito
      navigate(`/goal/${newGoal._id}`); // Redirige a la página de detalle de la nueva meta
    } catch (error) {
      console.error("Error al crear la meta:", error);
      toast.error(`Error al crear la meta: ${error instanceof Error ? error.message : "Error desconocido"}`, { id: "create-goal" }); // Notificación de error
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para manejar la cancelación
  const handleCancel = () => {
    navigate('/dashboard'); // Regresa al dashboard
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8]">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon" className="mr-4">
                <ArrowLeft className="h-5 w-5 text-[#64748B]" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-[#334155]">Crear Nueva Meta</h1>
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-xl mx-auto">
          <Card className="bg-white shadow-xl rounded-lg">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-2xl font-bold text-[#334155] text-center">
                Define Tu Próximo Objetivo
              </CardTitle>
              <p className="text-[#64748B] text-center">Crea una meta visual que te motive a ahorrar cada día</p>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Campo para el Título de la Meta */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-[#334155] font-semibold">
                    Nombre de la Meta <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="Ej: iPhone 15 Pro, Viaje a Europa..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="border-gray-300 focus:border-[#6EE7B7] focus:ring-[#6EE7B7]"
                  />
                </div>

                {/* Campo para el Monto Objetivo */}
                <div className="space-y-2">
                  <Label htmlFor="targetAmount" className="text-[#334155] font-semibold">
                    Monto Objetivo ($) <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#64748B]">$</span>
                    <Input
                      id="targetAmount"
                      type="number"
                      placeholder="1000"
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(parseFloat(e.target.value) || "")}
                      required
                      min="0"
                      step="0.01"
                      className="pl-8 border-gray-300 focus:border-[#6EE7B7] focus:ring-[#6EE7B7]"
                    />
                  </div>
                </div>

                {/* Sección de Carga de Imagen */}
                <div className="space-y-2">
                  <Label className="text-[#334155] font-semibold">Imagen de tu Meta</Label>
                  <p className="text-sm text-[#64748B]">Sube una imagen que represente lo que quieres comprar o lograr</p>

                  {!localImagePreview ? (
                    <div className="border-2 border-dashed border-[#6EE7B7] rounded-lg p-8 text-center hover:border-[#5DD4A8] transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="imageUpload"
                        disabled={isUploadingImage}
                      />
                      <label htmlFor="imageUpload" className="cursor-pointer">
                        <div className="w-16 h-16 bg-[#6EE7B7] bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                          {isUploadingImage ? (
                            <svg className="animate-spin h-8 w-8 text-[#6EE7B7]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <Upload className="h-8 w-8 text-[#6EE7B7]" />
                          )}
                        </div>
                        <p className="text-[#6EE7B7] font-semibold mb-2">
                          {isUploadingImage ? "Subiendo..." : "Subir Imagen"}
                        </p>
                        <p className="text-sm text-[#64748B]">Haz clic aquí o arrastra una imagen</p>
                      </label>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="aspect-[4/3] rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={localImagePreview}
                          alt="Previsualización de la meta"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 rounded-full h-8 w-8"
                        onClick={removeImage}
                        disabled={isUploadingImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Contenedor de Botones */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  {/* Botón Cancelar */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="w-full sm:w-1/2 bg-transparent text-[#64748B] hover:bg-gray-100 hover:text-[#334155] transition-colors"
                    disabled={isSubmitting || isUploadingImage}
                  >
                    Cancelar
                  </Button>

                  {/* Botón de Guardar Meta (Enviar) */}
                  <Button
                    type="submit"
                    className="w-full sm:w-1/2 bg-[#6EE7B7] hover:bg-[#5DD4A8] text-[#334155] font-semibold py-2 text-lg transition-all duration-300 hover:scale-[1.01] hover:shadow-md"
                    disabled={isSubmitting || isUploadingImage || !title || targetAmount === "" || targetAmount <= 0 || !imageUrl}
                  >
                    {isSubmitting ? "Creando Meta..." : "Guardar Meta"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}