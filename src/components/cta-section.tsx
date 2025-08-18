import { motion } from "motion/react";
import { ButtonPremium } from "@/components/ui/button-premium";
import { ArrowRight, MessageCircle, Play, CheckCircle, Zap, Shield, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface CTASectionProps {
  className?: string;
}

export function CTASection({ className }: CTASectionProps) {
  return (
    <section className={cn("py-24 relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900", className)}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float-orb" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float-orb" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl animate-pulse-glow" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-white/90">🚀 Déjà 500+ entreprises automatisées</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight">
              Prêt à Révolutionner
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400">
                Votre Productivité ?
              </span>
            </h2>
            
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Rejoignez l'élite des entreprises qui ont transformé leurs opérations avec l'IA. 
              <span className="text-cyan-300 font-semibold"> Gagnez 20h par semaine</span> et 
              <span className="text-purple-300 font-semibold"> augmentez votre ROI de 300%</span>.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
          >
            <Link to="/auth">
              <ButtonPremium 
                size="xl" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-2xl shadow-blue-500/25 group transform hover:scale-105 transition-all duration-300"
              >
                <span className="flex items-center gap-2">
                  <span className="relative">
                    <span className="absolute inset-0 bg-white/20 rounded-full blur-sm" />
                    <span className="relative bg-white/20 rounded-full p-1">
                      <Zap className="w-4 h-4" />
                    </span>
                  </span>
                  Commencer Gratuitement
                </span>
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </ButtonPremium>
            </Link>
            
            <Link to="/auth">
              <ButtonPremium 
                variant="outline" 
                size="xl" 
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm shadow-2xl group transform hover:scale-105 transition-all duration-300"
              >
                <MessageCircle className="mr-2 w-5 h-5" />
                Consultation Gratuite
              </ButtonPremium>
            </Link>
          </motion.div>

          {/* Trust Indicators Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Essai Gratuit 14 Jours</h3>
              <p className="text-white/70 text-sm">Testez sans risque, aucune carte de crédit requise</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Sans Engagement</h3>
              <p className="text-white/70 text-sm">Arrêtez à tout moment, aucune pénalité</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Support 24/7</h3>
              <p className="text-white/70 text-sm">Notre équipe d'experts est là pour vous aider</p>
            </div>
          </motion.div>

          {/* Demo Video CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="inline-flex items-center gap-4 text-white/90 hover:text-white transition-all duration-300 cursor-pointer group bg-white/5 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/10 hover:bg-white/10 hover:scale-105"
          >
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/25">
                <Play className="w-6 h-6 ml-1 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
            </div>
            <div className="text-left">
              <span className="text-lg font-semibold block">Voir la Démo</span>
              <span className="text-sm text-white/70">En seulement 2 minutes</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-auto"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            className="fill-white"
          />
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            className="fill-white"
          />
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            className="fill-white"
          />
        </svg>
      </div>
    </section>
  );
}
