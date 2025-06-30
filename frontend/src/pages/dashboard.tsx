// src/pages/DashboardPage.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Importa Link de react-router-dom

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, BadgeDollarSign} from "lucide-react";
// Importar los tipos y la URL base
import type { Goal, GoalProgress } from "@/types"; // Ajusta la ruta si es necesario
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function dashboard() { 
  
  // El estado para almacenar las metas, incluyendo su progreso actual
  const [goals, setGoals] = useState<(Goal & { currentAmount: number; percentage: number })[]>([]);

  const [loading, setLoading] = useState(true); // Estado de carga para la UX

  // Función para obtener todas las metas y su progreso desde el backend
  const fetchGoals = async () => {
    setLoading(true);
    try {
      const goalsResponse = await fetch(`${API_BASE_URL}/goals`);
      if (!goalsResponse.ok) {
        throw new Error("Error al cargar las metas");
      }
      const fetchedGoals: Goal[] = await goalsResponse.json();

      // Para cada meta, obtener su progreso específico
      const goalsWithProgress = await Promise.all(
        fetchedGoals.map(async (goal) => {
          try {
            const progressResponse = await fetch(
              `${API_BASE_URL}/contributions/progress/${goal._id}`
            );
            if (!progressResponse.ok) {
              console.warn(`No se pudo cargar el progreso para la meta ${goal.title}. Asumiendo 0%.`);
              return {
                ...goal,
                currentAmount: 0,
                percentage: 0,
              };
            }
            const progressData: GoalProgress = await progressResponse.json();
            return {
              ...goal,
              currentAmount: progressData.totalAportado,
              percentage: parseFloat(progressData.porcentajeAvance),
            };
          } catch (progressError) {
            console.error(`Error al obtener progreso para ${goal.title}:`, progressError);
            return {
              ...goal,
              currentAmount: 0,
              percentage: 0,
            };
          }
        })
      );
      setGoals(goalsWithProgress);
    } catch (error) {
      console.error("Hubo un error general al obtener las metas:", error);
      // Aquí puedes mostrar un mensaje de error global al usuario si lo deseas
    } finally {
      setLoading(false);
    }
  };

    // Cargar las metas al montar el componente (solo una vez)
  useEffect(() => {
    fetchGoals();
    // Podemos retornar una función de limpieza si fuera necesario, pero no en este caso simple.
  }, []);

  return (
    <div className="min-h-screen bg-[#F0F4F8]"> {/* Eliminado dark:bg-gray-900 */}
      {/* Header */}
      <header className="bg-white shadow-sm"> {/* Eliminado dark:bg-gray-800 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            
            <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-lg flex items-center justify-center">
              <BadgeDollarSign className="w-5 h-5 text-white" />
            </div>
            <Link to="/"> 
              <h1 className="text-2xl font-bold text-[#334155]">FillItUp</h1> {/* Eliminado dark:text-white */}
            </Link>
          </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/create-goal"> 
                <Button className="bg-[#6EE7B7] hover:bg-[#5DD4A8] text-[#334155] font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"> {/* Eliminado dark mode classes */}
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Nueva Meta
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#334155] mb-2">Mis Metas de Ahorro</h2> {/* Eliminado dark:text-white */}
          <p className="text-[#64748B]">Sigue el progreso de tus objetivos financieros</p> {/* Eliminado dark:text-gray-400 */}
        </div>

         {/* Goals Grid */}
        {loading ? (
          <div className="text-center text-[#64748B] text-lg py-10">Cargando metas...</div>
        ) : goals.length === 0 ? (
          <div className="text-center text-[#64748B] text-lg py-10">
            Aún no tienes metas. ¡Crea una para empezar haciendo click en "Crear Nueva Meta"!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {goals.map((goal) => (
              <Link to={`/goal/${goal._id}`} key={goal._id}>
                <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-500 cursor-pointer group hover:scale-105 transform">
                  <CardContent className="p-0">
                    {/* Goal Image with Animated Fill Effect */}
                    <div className="relative overflow-hidden rounded-t-lg">
                      {goal.imageUrl ? (
                        <div
                          className="aspect-[4/3] bg-cover bg-center"
                          style={{
                            backgroundImage: `url(${goal.imageUrl})`,
                            // Aquí la magia del relleno de imagen:
                            // Usamos un gradiente transparente que se vuelve opaco
                            // y "revela" la imagen original.
                            // Esto requiere que la imagen base esté desaturada o tenga baja opacidad
                            // y el gradiente la "desenmascare".
                            // Si quieres un efecto de "relleno de color sobre la imagen",
                            // el enfoque de mask-image que te di antes es más apropiado,
                            // pero es más complejo de hacer genérico.
                            // Para empezar, probemos con un gradiente que revela.
                            // Una alternativa más simple para el "relleno" visual es superponer un div
                            // cuyo background sea la imagen con un filtro (grayscale)
                            // y otro div encima con la imagen sin filtro,
                            // y controlar su altura con clip-path.

                            // Vamos a probar con una superposición simple para ilustrar:
                          }}
                        >
                          {/* Capa base desaturada */}
                          <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{
                              backgroundImage: `url(${goal.imageUrl})`,
                              filter: 'grayscale(100%) brightness(80%)', // Versión "vacía" de la imagen
                            }}
                          ></div>
                          {/* Capa de relleno (la imagen a color que se revela) */}
                          <div
                            className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-out"
                            style={{
                              backgroundImage: `url(${goal.imageUrl})`,
                              clipPath: `inset(${100 - goal.percentage}% 0 0 0)`, // Rellena de abajo hacia arriba
                            }}
                          ></div>
                          {/* Shimmer effect overlay */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 group-hover:animate-shimmer transition-opacity duration-300"></div>

                        </div>
                      ) : (
                        // Si no hay imageUrl, mostramos el gradiente de color como antes
                        <div
                          className="aspect-[4/3] relative flex items-center justify-center rounded-t-lg"
                          style={{
                            background: `linear-gradient(to top, #6EE7B7 0%, #6EE7B7 ${goal.percentage}%, rgba(229, 231, 235, 0.8) ${goal.percentage}%, rgba(229, 231, 235, 0.8) 100%)`,
                          }}
                        >
                          <span className="text-white font-bold text-lg bg-black bg-opacity-30 px-3 py-1 rounded transition-all duration-300 group-hover:bg-opacity-50 group-hover:scale-110">
                            {goal.title}
                          </span>
                        </div>
                      )}

                      {/* Animated progress indicator */}
                      <div className="absolute top-3 right-3 bg-white bg-opacity-90 rounded-full px-2 py-1 transition-all duration-300 group-hover:bg-opacity-100 group-hover:scale-110">
                        <span className="text-[#6EE7B7] font-bold text-sm">
                          {goal.percentage.toFixed(0)}%
                        </span>
                      </div>
                    </div>

                    {/* Goal Info with animations */}
                    <div className="p-4">
                      <h3 className="font-semibold text-[#334155] mb-2 group-hover:text-[#6EE7B7] transition-colors duration-300">
                        {goal.title}
                      </h3>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-[#64748B] transition-colors duration-300 group-hover:text-[#334155]">
                          ${goal.currentAmount.toLocaleString()} / $
                          {goal.targetAmount.toLocaleString()}
                        </span>
                      </div>

                      {/* Animated Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-[#6EE7B7] h-2 rounded-full transition-all duration-700 ease-out group-hover:bg-[#5DD4A8]"
                          style={{
                            width: `${goal.percentage}%`,
                            animation: `progressGrow 1s ease-out forwards`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}

            {/* Este "Crear Nueva Meta" ahora es solo un Link */}
            <Link to="/create-goal">
              <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-dashed border-[#6EE7B7] hover:border-[#5DD4A8]">
                <CardContent className="p-0">
                  <div className="aspect-[4/3] flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-[#6EE7B7] bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Plus className="h-8 w-8 text-[#6EE7B7]" />
                      </div>
                      <p className="text-[#6EE7B7] font-semibold">Crear Nueva Meta</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}