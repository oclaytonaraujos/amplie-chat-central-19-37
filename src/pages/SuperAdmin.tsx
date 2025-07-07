import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, Settings, Smartphone, BarChart3, Loader2 } from 'lucide-react';
import EmpresasTab from '@/components/admin/EmpresasTab';
import PlanosTab from '@/components/admin/PlanosTab';
import { WhatsAppTab } from '@/components/admin/WhatsAppTab';
import UsuariosTab from '@/components/admin/UsuariosTab';
import ZApiConfigTab from '@/components/admin/ZApiConfigTab';
import RelatoriosEstatisticasCard from '@/components/admin/RelatoriosEstatisticasCard';
import { useUserRole } from '@/hooks/useUserRole';

import QueueMonitoring from '@/components/admin/QueueMonitoring';
import { N8nIntegrationTab } from '@/components/admin/N8nIntegrationTab';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import PlanosGerenciamento from '@/components/admin/PlanosGerenciamento';
import PermissoesAvancadas from '@/components/admin/PermissoesAvancadas';
import IntegracoesCentralizadas from '@/components/admin/IntegracoesCentralizadas';
import ConfiguracoesAvancadas from '@/components/admin/ConfiguracoesAvancadas';
import { ErrorBoundaryAdmin } from '@/components/admin/ErrorBoundaryAdmin';
export default function SuperAdmin() {
  const {
    user,
    loading: authLoading
  } = useAuth();
  const {
    isSuperAdmin,
    loading: roleLoading
  } = useUserRole();
  console.log('SuperAdmin renderizado:', {
    user: user?.email,
    isSuperAdmin,
    authLoading,
    roleLoading
  });

  // Mostrar loading enquanto verifica permissões
  if (authLoading || roleLoading) {
    console.log('SuperAdmin - Aguardando carregamento...');
    return <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verificando permissões...</p>
        </div>
      </div>;
  }

  // Verificar se é super admin após carregamento completo
  if (!user || !isSuperAdmin) {
    console.log('SuperAdmin - Acesso negado:', {
      hasUser: !!user,
      userEmail: user?.email,
      isSuperAdmin
    });
    return <Navigate to="/painel" replace />;
  }
  console.log('✅ SuperAdmin - Acesso autorizado para:', user.email);
  return (
    <div className="min-h-screen bg-background">
      {/* Header do Super Admin */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Painel Super Admin</h1>
              <p className="text-sm text-muted-foreground">Gerencie todas as empresas e configurações da plataforma</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{user.email}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <ErrorBoundaryAdmin>
          <Tabs defaultValue="analytics" className="space-y-6">
          <div className="overflow-x-auto">
            <TabsList className="grid w-max grid-cols-5 lg:grid-cols-10 min-w-full lg:min-w-0">
              <TabsTrigger value="analytics" className="whitespace-nowrap">Analytics</TabsTrigger>
              <TabsTrigger value="empresas" className="whitespace-nowrap">Empresas</TabsTrigger>
              <TabsTrigger value="usuarios" className="whitespace-nowrap">Usuários</TabsTrigger>
              <TabsTrigger value="planos" className="whitespace-nowrap">Planos</TabsTrigger>
              <TabsTrigger value="permissoes" className="whitespace-nowrap">Permissões</TabsTrigger>
              <TabsTrigger value="integracoes" className="whitespace-nowrap">Integrações</TabsTrigger>
              <TabsTrigger value="configuracoes" className="whitespace-nowrap">Config</TabsTrigger>
              <TabsTrigger value="whatsapp" className="whitespace-nowrap">WhatsApp</TabsTrigger>
              <TabsTrigger value="n8n" className="whitespace-nowrap">n8n</TabsTrigger>
              <TabsTrigger value="filas" className="whitespace-nowrap">Filas</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics e Relatórios</CardTitle>
                <CardDescription>
                  Dashboard com métricas avançadas e relatórios personalizáveis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsDashboard />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="empresas">
            <Card>
              <CardHeader>
                <CardTitle>Gestão de Empresas</CardTitle>
                <CardDescription>
                  Gerencie todas as empresas cadastradas na plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EmpresasTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usuarios">
            <Card>
              <CardHeader>
                <CardTitle>Gestão de Usuários</CardTitle>
                <CardDescription>
                  Visualize e gerencie usuários de todas as empresas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UsuariosTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="planos">
            <Card>
              <CardHeader>
                <CardTitle>Gestão de Planos</CardTitle>
                <CardDescription>
                  Configure planos e permissões da plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PlanosGerenciamento />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissoes">
            <Card>
              <CardHeader>
                <CardTitle>Permissões Avançadas</CardTitle>
                <CardDescription>
                  Gerencie perfis e permissões granulares do sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PermissoesAvancadas />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integracoes">
            <Card>
              <CardHeader>
                <CardTitle>Integrações Centralizadas</CardTitle>
                <CardDescription>
                  Monitore webhooks, APIs e integrações do sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <IntegracoesCentralizadas />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="configuracoes">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Avançadas</CardTitle>
                <CardDescription>
                  Configurações técnicas e avançadas do sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ConfiguracoesAvancadas />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="whatsapp">
            <Card>
              <CardHeader>
                <CardTitle>Conexões WhatsApp</CardTitle>
                <CardDescription>
                  Monitore todas as conexões WhatsApp ativas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WhatsAppTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="zapi">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Z-API</CardTitle>
                <CardDescription>
                  Gerencie as configurações Z-API de todas as empresas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ZApiConfigTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="n8n">
            <Card>
              <CardHeader>
                <CardTitle>Integração n8n</CardTitle>
                <CardDescription>
                  Configure e monitore a integração com n8n para automações avançadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <N8nIntegrationTab />
              </CardContent>
            </Card>
          </TabsContent>


          <TabsContent value="filas">
            <QueueMonitoring />
          </TabsContent>
          </Tabs>
        </ErrorBoundaryAdmin>
      </div>
    </div>
  );
}