import { useState, useEffect, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom"; 
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { ArrowLeft, Plus, Edit, Trash2, Calendar } from "lucide-react"; 

import type{ Goal, Contribution, GoalProgress } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function GoalDetailPage() {
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();

  // Estados para almacenar los datos de la meta y el UI 
  const [goal, setGoal] = useState<Goal | null>(null);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [goalProgress, setGoalProgress] = useState<GoalProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contributionAmount, setContributionAmount] = useState("");
  const [isAddingContribution, setIsAddingContribution] = useState(false);

  // Estados para el modal de edición de meta (título y monto)
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedTargetAmount, setEditedTargetAmount] = useState("");

  // Estados para el modal de confirmación de eliminación ya sea meta o aporte
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'goal' | 'contribution', id?: string, title?: string } | null>(null);
  
  //Función asíncrona para cargar todos los datos de la meta, su progreso y sus aportes desde la API.
  const fetchData = useCallback(async () => {
    if (!id) {
      setError("ID de meta no proporcionado.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Obtener detalles básicos de la meta
      const goalResponse = await fetch(`${API_BASE_URL}/goals/${id}`);
      if (!goalResponse.ok) {
        const errorData = await goalResponse.json();
        throw new Error(errorData.error || `Error al cargar la meta: ${goalResponse.statusText}`);
      }
      const goalData: Goal = await goalResponse.json();
      setGoal(goalData);

      // Obtener el progreso de la meta (monto actual y porcentaje)
      const progressResponse = await fetch(`${API_BASE_URL}/contributions/progress/${id}`);
      if (!progressResponse.ok) {
        const errorData = await progressResponse.json();
        throw new Error(errorData.error || `Error al cargar el progreso: ${progressResponse.statusText}`);
      }
      const progressData: GoalProgress = await progressResponse.json();
      setGoalProgress(progressData);

      // Obtener el historial de contribuciones
      const contributionsResponse = await fetch(`${API_BASE_URL}/contributions/goal/${id}`);
      if (!contributionsResponse.ok) {
        const errorData = await contributionsResponse.json();
        throw new Error(errorData.error || `Error al cargar los aportes: ${contributionsResponse.statusText}`);
      }
      const contributionsData: Contribution[] = await contributionsResponse.json();
      setContributions(contributionsData);

    } catch (err) {
      console.error("Error fetching goal data:", err);
      setError(`No se pudieron cargar los detalles de la meta: ${err instanceof Error ? err.message : "Error desconocido"}`);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

   // Función para registrar un nuevo aporte a la meta, realiza validaciones y envía la solicitud POST a la API.
  const handleAddContribution = async () => {
    const amount = parseFloat(contributionAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Por favor, introduce un monto válido y positivo.");
      return;
    }
    if (!goal || !goalProgress) { 
      toast.error("No se pudo registrar el aporte: la meta o el progreso no están cargados.");
      return;
    }

    // Validación para no superar la meta ni exceda el monto restante
    const currentAmount = goalProgress.totalAportado;
    const remainingAmount = goal.targetAmount - currentAmount;

    if (amount > remainingAmount) {
      toast.error(`El aporte de $${amount.toLocaleString()} excede el monto restante para la meta ($${remainingAmount.toLocaleString()}).`);
      setContributionAmount(remainingAmount > 0 ? remainingAmount.toString() : "0");
      return;
    }

    setIsAddingContribution(true); // Activa el estado de carga para el botón de aporte
    try {
      // Envía la solicitud POST para añadir el aporte
      const response = await fetch(`${API_BASE_URL}/contributions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ goalId: goal._id, amount, note: "Aporte desde el detalle" }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error al añadir el aporte: ${response.statusText}`);
      }

      await fetchData(); // Vuelve a cargar los datos para actualizar la UI
      setContributionAmount("");
      toast.success("Aporte registrado con éxito!");
    } catch (err) {
      console.error("Error adding contribution:", err);
      toast.error(`Error al registrar el aporte: ${err instanceof Error ? err.message : "Error desconocido"}`); 
    } finally {
      setIsAddingContribution(false);
    }
  };


  // Se usa para actualizar el título y el monto objetivo de la meta.
  const handleEditGoal = async () => {
    if (!goal) return;

    const updatedTargetAmount = parseFloat(editedTargetAmount);
    if (isNaN(updatedTargetAmount) || updatedTargetAmount <= 0) {
      toast.error("Por favor, introduce un monto objetivo válido y positivo.");
      return;
    }

    const updates: { title?: string; targetAmount?: number } = {};

    if (editedTitle !== goal.title) {
      updates.title = editedTitle;
    }

    if (updatedTargetAmount !== goal.targetAmount) {
      updates.targetAmount = updatedTargetAmount;
    }

    // Si no hay cambios en título ni monto, se cierra el modal
    if (Object.keys(updates).length === 0) {
      setIsEditingGoal(false);
      toast.info("No se detectaron cambios en el título o monto.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/goals/${goal._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates), // Se envia solo los campos que cambiaron
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error al actualizar la meta: ${response.statusText}`);
      }

      setIsEditingGoal(false); // Cierra el modal
      await fetchData(); // Refresca los datos para mostrar los cambios
      toast.success("Meta actualizada con éxito!");
    } catch (err) {
      console.error("Error updating goal:", err);
      toast.error(`Error al actualizar la meta: ${err instanceof Error ? err.message : "Error desconocido"}`);
    }
  };

  // Prepara el modal de confirmación para eliminar la meta
  const handleDeleteGoal = async () => {
    if (!goal) return;
    // Establece el tipo de elemento a eliminar y abre el modal de confirmación
    setItemToDelete({ type: 'goal', id: goal._id, title: goal.title });
    setShowDeleteConfirmModal(true);
  };

  // Prepara el modal de confirmación para eliminar un aporte específico.
  const handleDeleteContribution = async (contributionId: string) => {
    setItemToDelete({ type: 'contribution', id: contributionId });
    setShowDeleteConfirmModal(true);
  };
  
  //Función que ejecuta la eliminación confirmada de una meta o un aporte, según el itemToDelete establecido.
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    setShowDeleteConfirmModal(false); // Cierra el modal inmediatamente

    try {
      // Para eliminar una meta
      if (itemToDelete.type === 'goal' && itemToDelete.id) {
        const response = await fetch(`${API_BASE_URL}/goals/${itemToDelete.id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Error al eliminar la meta: ${response.statusText}`);
        }

        toast.success("Meta eliminada con éxito!"); 
        navigate("/dashboard");
      } 
      //Para eliminar un aporte
      else if (itemToDelete.type === 'contribution' && itemToDelete.id) {
        const response = await fetch(`${API_BASE_URL}/contributions/${itemToDelete.id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Error al eliminar el aporte: ${response.statusText}`);
        }

        toast.success("Aporte eliminado con éxito!");
        await fetchData();
      }
    } catch (err) {
      console.error("Error deleting item:", err);
      toast.error(`Error al eliminar: ${err instanceof Error ? err.message : "Error desconocido"}`); 
    } finally {
      setItemToDelete(null); // Limpia el estado del item a eliminar
    }
  };

  const getProgressMessage = (percentage: number) => {
    if (percentage >= 100) {
      return "¡Meta Completada!";
    } else if (percentage >= 90) {
      return "¡Casi listo!";
    } else if (percentage >= 50) {
      return "¡Vas muy bien!";
    } else {
      return "¡Sigue avanzando!";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center text-xl text-[#334155]">
        Cargando meta...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F0F4F8] flex flex-col items-center justify-center text-xl text-red-500 p-4">
        <p className="text-center">{error}</p>
        <Button onClick={() => navigate("/dashboard")} className="mt-4 bg-[#6EE7B7] hover:bg-[#5DD4A8] text-[#334155]">
          Volver al Dashboard
        </Button>
      </div>
    );
  }

  if (!goal || !goalProgress) {
    return (
      <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center text-xl text-[#334155]">
        Meta no encontrada o datos incompletos del servidor.
        <Link to="/dashboard" className="ml-4 text-[#6EE7B7] hover:underline">
          Volver al Dashboard
        </Link>
      </div>
    );
  }
   // Cálculo de valores derivados para el renderizado
  const currentAmount = goalProgress.totalAportado;
  const currentPercentage = parseFloat(goalProgress.porcentajeAvance);
  const remaining = goal.targetAmount - currentAmount;
  const sortedContributions = [...contributions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-screen bg-[#F0F4F8]">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Link to="/dashboard">
                <Button variant="ghost" size="icon" className="mr-4">
                  <ArrowLeft className="h-5 w-5 text-[#64748B]" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-[#334155]">{goal.title}</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                title="Editar Meta"
                onClick={() => {
                  setIsEditingGoal(true); // Abre el modal de edición
                  setEditedTitle(goal.title); // Inicializa el input del título
                  setEditedTargetAmount(goal.targetAmount.toString()); // Inicializa el input del monto
                }}
              >
                <Edit className="h-5 w-5 text-[#64748B]" />
              </Button>

              {/* Boton para eliminar la meta */}
              <Button 
                variant="ghost" 
                size="icon" 
                title="Eliminar Meta"
                onClick={handleDeleteGoal}
                className="hover:bg-red-100"
              >
                <Trash2 className="h-5 w-5 text-red-500" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/*  Contenido principal de la página */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">

          {/* Sección de visualización de la meta */}
          <div>
            <Card className="bg-white shadow-xl overflow-hidden">
              <CardContent className="p-6">
                <div className="relative overflow-hidden rounded-lg mb-6">

                  {/*  Para mostrar la imagen con efecto de relleno */}
                  {goal.imageUrl && (
                    <div className="aspect-[4/3] relative overflow-hidden rounded-lg">
                      {/* Capa base desaturada */}
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${goal.imageUrl})`,
                          filter: 'grayscale(100%) brightness(80%)', 
                        }}
                      ></div>
                      {/* Capa de relleno donde la imagen a color se revela */}
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-out"
                        style={{
                          backgroundImage: `url(${goal.imageUrl})`,
                          clipPath: `inset(${100 - currentPercentage}% 0 0 0)`,
                        }}
                      ></div>
                      
                    </div>
                  )}

                  {/* Parte del contenido superpuesto (nombre de la meta, porcentaje) */}
                  <div className="absolute inset-0 flex flex-col justify-between p-4">
                      {/* Indicador de porcentaje flotante */}
                      <div className="absolute top-4 right-4 bg-[#6EE7B7] rounded-full px-4 py-2 transition-all duration-300 hover:scale-110 hover:bg-[#5DD4A8] z-10">
                        <span className="text-[#334155] font-bold text-lg animate-pulse">{Math.round(currentPercentage)}%</span>
                      </div>

                      {/* Mensaje de progreso flotante */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
                          <div className="bg-[#6EE7B7] text-[#334155] font-bold px-4 py-2 rounded-full shadow-lg">
                            {getProgressMessage(currentPercentage)}
                          </div>
                      </div>
                  </div>

                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full opacity-0 animate-sparkle animation-delay-0"></div>
                    <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full opacity-0 animate-sparkle animation-delay-500"></div>
                    <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-white rounded-full opacity-0 animate-sparkle animation-delay-1000"></div>
                  </div>
                </div>

                {/* Informacion de progreso como monto y barras de progresos */}
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#334155] mb-2 transition-all duration-300 hover:text-[#6EE7B7]">
                    ${currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
                  </div>
                  <div className="text-[#64748B] mb-4 transition-colors duration-300">
                    Faltan ${remaining.toLocaleString()} para completar tu meta
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-4 mb-6 overflow-hidden shadow-inner">
                    <div
                      className="bg-gradient-to-r from-[#6EE7B7] to-[#5DD4A8] h-4 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                      style={{
                        width: `${currentPercentage}%`,
                        boxShadow: currentPercentage > 50 ? "0 0 10px rgba(110, 231, 183, 0.5)" : "none",
                      }}
                    >                      
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-slide-right"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sección de acciones y historial de aportes */}
          <div className="space-y-6">
            <Card className="bg-white shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-[#334155] mb-4">Registrar Aporte</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="contribution" className="text-[#334155] font-medium">
                      Monto del Aporte
                    </Label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#64748B]">$</span>
                      <Input
                        id="contribution"
                        type="number"
                        placeholder="50"
                        value={contributionAmount}
                        onChange={(e) => setContributionAmount(e.target.value)}
                        className="pl-8 border-gray-300 focus:border-[#6EE7B7] focus:ring-[#6EE7B7]"
                      />
                    </div>
                  </div>
                  <Button
                    className="w-full bg-[#6EE7B7] hover:bg-[#5DD4A8] text-[#334155] font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg transform group"
                    onClick={handleAddContribution}
                    disabled={!contributionAmount || isAddingContribution || parseFloat(contributionAmount) <= 0}
                  >
                    {isAddingContribution ? (
                      <svg className="animate-spin h-5 w-5 text-[#334155] mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <Plus className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:rotate-90" />
                    )}
                    {isAddingContribution ? "Registrando..." : "Registrar Aporte"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tarjeta para el historial de aportes */}
            <Card className="bg-white shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-[#334155] mb-4">Historial de Aportes</h3>
                <div className="space-y-3">
                  {sortedContributions.length > 0 ? (
                     // Mapea y muestra cada aporte ordenado
                    sortedContributions.map((contribution) => (
                      <div
                        key={contribution._id}
                        className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-[#6EE7B7] bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                            <Calendar className="h-4 w-4 text-[#6EE7B7]" />
                          </div>
                          <div>
                            <div className="font-medium text-[#334155]">${contribution.amount.toLocaleString()}</div>
                            <div className="text-sm text-[#64748B]">
                              {new Date(contribution.date).toLocaleDateString("es-ES", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Botón para eliminar Aporte */}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteContribution(contribution._id)}
                          className="text-red-400 hover:text-red-600 hover:bg-red-50"
                          title="Eliminar aporte"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-[#64748B]">No hay aportes registrados aún.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Modal de Edición de Meta*/}
      {isEditingGoal && goal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
                <CardContent>
                    <h3 className="text-2xl font-bold text-[#334155] mb-6 text-center">Editar Meta</h3>
                    <div className="space-y-4">
                        {/* Campo para editar el Título */}
                        <div>
                            <Label htmlFor="editTitle" className="text-[#334155]">Título</Label>
                            <Input 
                                id="editTitle" 
                                value={editedTitle} 
                                onChange={(e) => setEditedTitle(e.target.value)} 
                                className="mt-1"
                            />
                        </div>
                        {/* Campo para editar el Monto Objetivo */}
                        <div>
                            <Label htmlFor="editTargetAmount" className="text-[#334155]">Monto Objetivo</Label>
                            <Input 
                                id="editTargetAmount" 
                                type="number" 
                                value={editedTargetAmount} 
                                onChange={(e) => setEditedTargetAmount(e.target.value)} 
                                className="mt-1"
                            />
                        </div>
                        <div className="flex justify-end space-x-4 mt-6">
                            <Button 
                                variant="outline" 
                                onClick={() => setIsEditingGoal(false)}
                                className="border-[#64748B] text-[#64748B] hover:bg-gray-100"
                            >
                                Cancelar
                            </Button>
                            <Button 
                                onClick={handleEditGoal}
                                className="bg-[#6EE7B7] hover:bg-[#5DD4A8] text-[#334155]"
                            >
                                Guardar Cambios
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      )}
  
     {/* Modal de Confirmación de Eliminación */}
      <Dialog open={showDeleteConfirmModal} onOpenChange={setShowDeleteConfirmModal}>
        <DialogContent className="w-[90%] max-w-sm p-8 sm:p-5 rounded-md">
          <DialogHeader>
            <DialogTitle>
              {itemToDelete?.type === 'goal' ? `¿Estás seguro de eliminar la meta "${itemToDelete.title}"?` : "¿Estás seguro de eliminar este aporte?"}
            </DialogTitle>
            <DialogDescription>
              {itemToDelete?.type === 'goal'
                ? "Esta acción es irreversible y eliminará todos los aportes asociados a esta meta."
                : "Esta acción es irreversible."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row gap-2 justify-end">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="button" variant="destructive" onClick={handleConfirmDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}