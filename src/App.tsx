
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import { useNavigationTracking } from "@/hooks/useNavigationTracking";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Layout } from "@/components/layout/Layout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { queryClient } from "@/config/queryClient";
import { NotificationProvider, NotificationPermissionRequest } from "@/components/notifications/NotificationSystem";
import { ServiceWorkerProvider } from "@/hooks/useServiceWorker";
import { AccessibilityProvider } from "@/components/ui/accessibility-features";
import { TemplateProvider } from "@/components/templates/MessageTemplates";
import { ShortcutProvider } from "@/components/ui/shortcut-manager";
import { PerformanceMonitor } from "@/components/ui/performance-monitor";

// Lazy Loading de Páginas
import { lazy, Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/enhanced-loading";

// Páginas sempre carregadas (críticas)
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";

// Páginas com lazy loading
const SuperAdmin = lazy(() => import("@/pages/SuperAdmin"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Atendimento = lazy(() => import("@/pages/Atendimento"));
const ChatInterno = lazy(() => import("@/pages/ChatInterno"));
const Contatos = lazy(() => import("@/pages/Contatos"));
const Kanban = lazy(() => import("@/pages/Kanban"));
const ChatBot = lazy(() => import("@/pages/ChatBot"));
const Automations = lazy(() => import("@/pages/Automations"));
const Usuarios = lazy(() => import("@/pages/Usuarios"));
const Setores = lazy(() => import("@/pages/Setores"));
const GerenciarEquipe = lazy(() => import("@/pages/GerenciarEquipe"));
const MeuPerfil = lazy(() => import("@/pages/MeuPerfil"));
const PlanoFaturamento = lazy(() => import("@/pages/PlanoFaturamento"));
const FlowBuilder = lazy(() => import("@/pages/FlowBuilder"));
const Painel = lazy(() => import("@/pages/Painel"));
const MelhoriasDashboard = lazy(() => import("@/pages/MelhoriasDashboard"));
const ConfiguracoesGerais = lazy(() => import("@/pages/configuracoes/ConfiguracoesGerais"));
const ConfiguracoesAvancadas = lazy(() => import("@/pages/configuracoes/ConfiguracoesAvancadas"));
const PreferenciasNotificacao = lazy(() => import("@/pages/configuracoes/PreferenciasNotificacao"));
const Aparencia = lazy(() => import("@/pages/configuracoes/Aparencia"));
const Idioma = lazy(() => import("@/pages/configuracoes/Idioma"));

// Componente de fallback para lazy loading
const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
);

function AppRoutes() {
  useNavigationTracking();

  return (
    <Routes>
      {/* Página inicial */}
      <Route path="/" element={<Index />} />
      
      {/* Rota de autenticação */}
      <Route path="/auth" element={<Auth />} />
      
      {/* Rota Super Admin */}
      <Route path="/admin" element={
        <ProtectedRoute>
          <Suspense fallback={<PageFallback />}>
            <SuperAdmin />
          </Suspense>
        </ProtectedRoute>
      } />
      
      {/* Rotas protegidas principais */}
      <Route path="/painel" element={
        <ProtectedRoute>
          <Layout title="Painel" description="Visão geral do sistema">
            <Suspense fallback={<PageFallback />}>
              <Painel />
            </Suspense>
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout title="Dashboard" description="Métricas e estatísticas">
            <Suspense fallback={<PageFallback />}>
              <Dashboard />
            </Suspense>
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/atendimento" element={
        <ProtectedRoute>
          <Layout title="Atendimento" description="Central de atendimento">
            <Suspense fallback={<PageFallback />}>
              <Atendimento />
            </Suspense>
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/chat-interno" element={
        <ProtectedRoute>
          <Layout title="Chat Interno" description="Comunicação da equipe">
            <Suspense fallback={<PageFallback />}>
              <ChatInterno />
            </Suspense>
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/contatos" element={
        <ProtectedRoute>
          <Layout title="Contatos" description="Gerenciamento de contatos">
            <Suspense fallback={<PageFallback />}>
              <Contatos />
            </Suspense>
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/kanban" element={
        <ProtectedRoute>
          <Layout title="Kanban" description="Quadro de tarefas">
            <Suspense fallback={<PageFallback />}>
              <Kanban />
            </Suspense>
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/chatbot" element={
        <ProtectedRoute>
          <Layout title="ChatBot" description="Automação inteligente">
            <Suspense fallback={<PageFallback />}>
              <ChatBot />
            </Suspense>
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/chatbot/flow-builder/:id" element={
        <ProtectedRoute>
          <Suspense fallback={<PageFallback />}>
            <FlowBuilder />
          </Suspense>
        </ProtectedRoute>
      } />
      
      <Route path="/automations" element={
        <ProtectedRoute>
          <Layout title="Automações" description="Fluxos de automação">
            <Suspense fallback={<PageFallback />}>
              <Automations />
            </Suspense>
          </Layout>
        </ProtectedRoute>
      } />
      
      
      <Route path="/usuarios" element={
        <ProtectedRoute>
          <Layout title="Usuários" description="Gerenciamento de usuários">
            <Suspense fallback={<PageFallback />}>
              <Usuarios />
            </Suspense>
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/setores" element={
        <ProtectedRoute>
          <Layout title="Setores" description="Organização por setores">
            <Suspense fallback={<PageFallback />}>
              <Setores />
            </Suspense>
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/gerenciar-equipe" element={
        <ProtectedRoute>
          <Layout title="Gerenciar Equipe" description="Administração da equipe">
            <Suspense fallback={<PageFallback />}>
              <GerenciarEquipe />
            </Suspense>
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/meu-perfil" element={
        <ProtectedRoute>
          <Layout title="Meu Perfil" description="Configurações pessoais">
            <Suspense fallback={<PageFallback />}>
              <MeuPerfil />
            </Suspense>
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/plano-faturamento" element={
        <ProtectedRoute>
          <Layout title="Plano e Faturamento" description="Gerenciamento financeiro">
            <Suspense fallback={<PageFallback />}>
              <PlanoFaturamento />
            </Suspense>
          </Layout>
        </ProtectedRoute>
      } />

      {/* Rotas de configuração */}
      <Route path="/configuracoes/gerais" element={
        <ProtectedRoute>
          <Layout title="Configurações Gerais" description="Configurações do sistema">
            <Suspense fallback={<PageFallback />}>
              <ConfiguracoesGerais />
            </Suspense>
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/configuracoes/avancadas" element={
        <ProtectedRoute>
          <Layout title="Configurações Avançadas" description="Configurações técnicas">
            <Suspense fallback={<PageFallback />}>
              <ConfiguracoesAvancadas />
            </Suspense>
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/configuracoes/notificacoes" element={
        <ProtectedRoute>
          <Layout title="Notificações" description="Preferências de notificação">
            <Suspense fallback={<PageFallback />}>
              <PreferenciasNotificacao />
            </Suspense>
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/configuracoes/aparencia" element={
        <ProtectedRoute>
          <Layout title="Aparência" description="Personalização visual">
            <Suspense fallback={<PageFallback />}>
              <Aparencia />
            </Suspense>
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/configuracoes/idioma" element={
        <ProtectedRoute>
          <Layout title="Idioma" description="Configurações de idioma">
            <Suspense fallback={<PageFallback />}>
              <Idioma />
            </Suspense>
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <ServiceWorkerProvider>
            <AccessibilityProvider>
              <NotificationProvider>
                <TemplateProvider>
                  <ShortcutProvider>
                    <AuthProvider>
                      <TooltipProvider>
                        <Toaster />
                        <Sonner />
                        <NotificationPermissionRequest />
                        <PerformanceMonitor showDebugInfo={process.env.NODE_ENV === 'development'} />
                        <BrowserRouter>
                          <AppRoutes />
                        </BrowserRouter>
                      </TooltipProvider>
                    </AuthProvider>
                  </ShortcutProvider>
                </TemplateProvider>
              </NotificationProvider>
            </AccessibilityProvider>
          </ServiceWorkerProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
