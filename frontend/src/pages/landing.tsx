import { Button } from "../components/ui/button";
import { CardContent } from "../components/ui/card";
import {
  BadgeDollarSign,
  Eye,
  TrendingUp,
  CheckCircle,
  Smartphone,
  MapPin,
  Car,
  Home,
  ArrowRight,
  Play,
  Target,
  Thermometer,
  Zap,
  Ghost,
  PartyPopper,
  Mail,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, easeOut } from "framer-motion";

export default function FillItUpLanding() {
  const navigate = useNavigate();

  //Redirecciona al usuario a la ruta "/dashboard" de la aplicación.
  const handleStartClick = () => {
    navigate("/dashboard");
  };

  // Define las variantes de animación para Framer Motion
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: easeOut, 
        staggerChildren: 0.15,
      },
    },
  };

  // Animaciones para elementos individuales dentro de un contenedor
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const delayItemVariants = (delay = 0) => ({
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay,
        duration: 0.6,
        ease: easeOut, 
      },
    },
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-lg flex items-center justify-center">
              <BadgeDollarSign className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-700">FillItUp</span>
          </div>
          <Button
            className="bg-emerald-400 hover:bg-emerald-500 text-slate-800 font-semibold px-6"
            onClick={handleStartClick}
          >
            Empezar
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeOut }} 
            className="text-5xl md:text-6xl font-bold text-slate-700 mb-6 leading-tight"
          >
            Haz Realidad Tus Metas,
            <br />
            <span className="text-emerald-500 animate-gradient-text">
              Paso a Paso
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeOut, delay: 0.2 }}
            className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Transforma tus sueños en progreso tangible. Mira cómo tus metas
            financieras cobran vida con cada aporte.
          </motion.p>

          {/* Demostración Visual del Progreso */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeOut, delay: 0.4 }} 
            className="max-w-md mx-auto mb-12 relative"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 hover:shadow-3xl transition-all duration-500 animate-float">
              <h3 className="text-lg font-semibold text-slate-700 mb-4">
                Mi iPhone 15 Pro
              </h3>
              <div className="relative w-32 h-48 mx-auto mb-6 group">
                <div className="absolute inset-0 border-4 border-slate-300 rounded-2xl bg-slate-100 transition-all duration-300 group-hover:border-slate-400">
                  <Smartphone className="w-full h-full text-slate-300 p-4 transition-colors duration-300" />
                </div>
                {/* Efecto de relleno - 70% lleno con animación */}
                <div
                  className="absolute inset-0 border-4 border-emerald-400 rounded-2xl bg-gradient-to-t from-emerald-400 to-emerald-300 overflow-hidden animate-fill-up transition-all duration-300 group-hover:border-emerald-500"
                  style={{ clipPath: "inset(30% 0 0 0)" }}
                >
                  <Smartphone
                    className="w-full h-full text-white p-4 animate-pulse-soft"
                    style={{ filter: "brightness(0.9)" }}
                  />
                </div>
                {/* Indicador de porcentaje flotante */}
                <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 animate-bounce-soft">
                  <div className="bg-emerald-400 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg animate-glow">
                    70%
                  </div>
                </div>
              </div>
              {/* Barra de progreso y monto */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Progreso</span>
                  <span className="font-semibold text-slate-700 animate-counter">
                    $700 / $1,000
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-2 rounded-full transition-all duration-1000 ease-out animate-progress-bar shadow-sm"
                    style={{ width: "70%" }}
                  ></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Botón principal de llamada a la acción */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeOut, delay: 0.6 }} 
          >
            <Button
              size="lg"
              className="bg-emerald-400 hover:bg-emerald-500 text-slate-800 font-semibold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 group"
              onClick={handleStartClick}
            >
              Comenzar Mi Primera Meta
              <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <motion.section
        className="py-20 bg-slate-50"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              variants={itemVariants}
              className="text-4xl font-bold text-slate-700 mb-6"
            >
              ¿Te Cuesta Ahorrar Sin Motivación?
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-xl text-slate-600 max-w-2xl mx-auto"
            >
              Sabemos lo difícil que es mantener la disciplina cuando no ves el
              progreso
            </motion.p>
          </div>

          <motion.div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[ 
               // Array de objetos, cada uno representando un problema con título, descripción e icono.
              {
                title: "Números Fríos",
                description: "Ver solo cifras en tu cuenta no inspira ni motiva a seguir ahorrando",
                icon: <Thermometer className="w-8 h-8 text-slate-600" />,
              },
              {
                title: "Falta de Motivación",
                description: "Sin una visualización clara, es fácil perder el enfoque en tus objetivos",
                icon: <Zap className="w-8 h-8 text-slate-600" />,
              },
              {
                title: "Sueños Lejanos",
                description: "Tus metas se sienten imposibles cuando no ves el progreso real",
                icon: <Ghost className="w-8 h-8 text-slate-600" />,
              },
              {
                title: "Sin Celebración",
                description: "No hay momentos de satisfacción en el camino hacia tu objetivo",
                icon: <PartyPopper className="w-8 h-8 text-slate-600" />,
              },
            ].map((item, index) => (
              // Mapea el array para renderizar cada problema como un `motion.div` animado.
              <motion.div
                key={index}
                variants={delayItemVariants(index * 0.15)}
                className="text-center"
              >
                <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>


      {/* Solution Section */}
      <motion.section
        className="py-20 bg-white"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              variants={itemVariants}
              className="text-4xl font-bold text-slate-700 mb-6"
            >
              Así Convierte FillItUp Tus Sueños en Realidad
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-xl text-slate-600 max-w-2xl mx-auto"
            >
              Con cada aporte que haces, tu meta cobra vida visual, manteniendote motivado
              hasta alcanzarla
            </motion.p>
          </div>

          <motion.div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              // Array de objetos, cada uno representando una característica clave de la solución.
              {
                icon: <Eye className="w-8 h-8" />,
                title: "Visualiza tu Éxito",
                description: "Ve cómo tu meta se llena de color con cada aporte. Ver tu progreso nunca fue tan claro y motivador.",
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: "Metas Claras",
                description: "Define objetivos específicos con imágenes reales. Desde un iPhone hasta unas vacaciones soñadas.",
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "Progreso Visible",
                description: "Cada depósito se refleja instantáneamente en tu imagen, creando una experiencia visual única.",
              },
            ].map((feature, index) => (
              // Mapea el array para renderizar cada característica como un `motion.div` con animaciones.
              <motion.div
                key={index}
                variants={delayItemVariants(index * 0.2)}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-500 bg-white group hover:-translate-y-2"
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:bg-emerald-200 group-hover:scale-110 animate-icon-bounce">
                    <div className="text-emerald-500 transition-colors duration-300 group-hover:text-emerald-600">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-700 mb-4 transition-colors duration-300 group-hover:text-emerald-600">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>


      {/* Seccion Cómo funciona la aplicación */}
      <motion.section
        className="py-20 bg-slate-50"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              variants={itemVariants}
              className="text-4xl font-bold text-slate-700 mb-6"
            >
              Comienza a Ahorrar en 3 Pasos Simples
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-xl text-slate-600 max-w-2xl mx-auto"
            >
              En menos de 5 minutos tendrás tu primera meta configurada y lista
              para empezar
            </motion.p>
          </div>

          <motion.div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Crea Tu Meta",
                  description: "Elige qué quieres conseguir, sube una imagen y define cuánto necesitas ahorrar.",
                  icon: <Target className="w-12 h-12" />,
                },
                {
                  step: "2",
                  title: "Aporta y Observa",
                  description: "Cada vez que ahorres, ve cómo tu imagen se llena de color desde abajo hacia arriba.",
                  icon: <Play className="w-12 h-12" />,
                },
                {
                  step: "3",
                  title: "¡Alcanza y Celebra!",
                  description: "Cuando tu imagen esté completamente llena, habrás alcanzado tu meta. ¡Es momento de celebrar!",
                  icon: <CheckCircle className="w-12 h-12" />,
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  variants={delayItemVariants(index * 0.25)}
                  className="text-center relative"
                >
                  <div className="relative z-10">
                    <div
                      className="w-20 h-20 bg-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg transition-all duration-300 hover:bg-emerald-500 hover:scale-110 animate-step-bounce group"
                      style={{ animationDelay: `${index * 200}ms` }}
                    >
                      <span className="text-2xl font-bold text-white transition-transform duration-300 group-hover:scale-110">
                        {step.step}
                      </span>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
                      <div className="text-emerald-500 mb-4 flex justify-center transition-all duration-300 group-hover:scale-110 group-hover:text-emerald-600">
                        {step.icon}
                      </div>
                      <h3 className="text-xl font-semibold text-slate-700 mb-3 transition-colors duration-300 group-hover:text-emerald-600">
                        {step.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Seccion ejemplos de meta */}
      <motion.section
        className="py-20 bg-white"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              variants={itemVariants}
              className="text-4xl font-bold text-slate-700 mb-6"
            >
              Metas Populares de Nuestros Usuarios
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-xl text-slate-600 max-w-2xl mx-auto"
            >
              Inspírate con las metas más comunes y comienza la tuya hoy mismo
            </motion.p>
          </div>

          <motion.div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: <Smartphone className="w-8 h-8" />,
                name: "iPhone 15 Pro",
                amount: "$1,200",
                color: "from-blue-400 to-blue-500",
              },
              {
                icon: <MapPin className="w-8 h-8" />,
                name: "Viaje a Europa",
                amount: "$3,500",
                color: "from-purple-400 to-purple-500",
              },
              {
                icon: <Car className="w-8 h-8" />,
                name: "Auto Nuevo",
                amount: "$25,000",
                color: "from-red-400 to-red-500",
              },
              {
                icon: <Home className="w-8 h-8" />,
                name: "Enganche Casa",
                amount: "$50,000",
                color: "from-green-400 to-green-500",
              },
            ].map((goal, index) => (
              <motion.div
                key={index}
                variants={delayItemVariants(index * 0.1)}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${goal.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <div className="text-white">{goal.icon}</div>
                  </div>
                  <h3 className="font-semibold text-slate-700 mb-2">
                    {goal.name}
                  </h3>
                  <p className="text-emerald-500 font-bold">{goal.amount}</p>
                </CardContent>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>


      {/* Final CTA Section */}
      <motion.section
        className="py-20 bg-gradient-to-r from-emerald-400 to-emerald-500"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Tu Futuro Comienza Hoy
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto"
          >
            Únete a miles de personas que ya están convirtiendo sus sueños en
            realidad con FillItUp
          </motion.p>
          {/* Botón final de llamada a la acción */}
          <motion.div variants={delayItemVariants(0.4)}>
            <Button
              size="lg"
              className="bg-white hover:bg-gray-50 text-emerald-600 font-semibold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
              onClick={handleStartClick}
            >
              Crear Mi Primera Meta Gratis
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
          <motion.p
            variants={delayItemVariants(0.5)}
            className="text-emerald-100 text-sm mt-4"
          >
            Sin tarjeta de crédito • Configuración en 2 minutos
          </motion.p>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-lg flex items-center justify-center">
                <BadgeDollarSign className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold">FillItUp</span>
            </div>
            <div className="flex space-x-6 text-sm">
              <a
                href="mailto:mariannisgarcia11@gmail.com?subject=Consulta%20desde%20FillItUp"
                className="text-slate-300 hover:text-white transition-colors flex items-center"
              >
                <Mail className="w-4 h-4 mr-1" /> Contacto
              </a>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400 text-sm">
            <p>&copy; {new Date().getFullYear()} FillItUp. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer> 
    </div>
  );
} 