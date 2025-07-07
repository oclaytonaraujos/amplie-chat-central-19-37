import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { 
  BarChart3, 
  Download, 
  FileText, 
  Table, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Users,
  MessageCircle,
  Clock,
  Target,
  Filter,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface ReportData {
  atendimentos: {
    total: number;
    resolvidos: number;
    pendentes: number;
    tempoMedio: string;
    satisfacao: number;
  };
  agentes: {
    total: number;
    ativos: number;
    produtividade: Array<{
      nome: string;
      atendimentos: number;
      tempo: string;
      satisfacao: number;
    }>;
  };
  canais: {
    whatsapp: number;
    chatInterno: number;
    email: number;
  };
  horarios: Array<{
    hora: string;
    volume: number;
  }>;
  metricas: {
    tempoResposta: string;
    taxaResolucao: number;
    nps: number;
    volumeDiario: number;
  };
}

const mockData: ReportData = {
  atendimentos: {
    total: 1247,
    resolvidos: 1089,
    pendentes: 158,
    tempoMedio: '4m 32s',
    satisfacao: 4.6
  },
  agentes: {
    total: 12,
    ativos: 8,
    produtividade: [
      { nome: 'Ana Silva', atendimentos: 89, tempo: '3m 45s', satisfacao: 4.8 },
      { nome: 'João Santos', atendimentos: 76, tempo: '4m 12s', satisfacao: 4.5 },
      { nome: 'Maria Costa', atendimentos: 92, tempo: '3m 58s', satisfacao: 4.7 },
      { nome: 'Pedro Lima', atendimentos: 65, tempo: '5m 22s', satisfacao: 4.3 }
    ]
  },
  canais: {
    whatsapp: 856,
    chatInterno: 267,
    email: 124
  },
  horarios: [
    { hora: '08:00', volume: 45 },
    { hora: '09:00', volume: 78 },
    { hora: '10:00', volume: 95 },
    { hora: '11:00', volume: 112 },
    { hora: '12:00', volume: 87 },
    { hora: '13:00', volume: 65 },
    { hora: '14:00', volume: 89 },
    { hora: '15:00', volume: 134 },
    { hora: '16:00', volume: 156 },
    { hora: '17:00', volume: 142 },
    { hora: '18:00', volume: 98 }
  ],
  metricas: {
    tempoResposta: '2m 15s',
    taxaResolucao: 87.3,
    nps: 8.4,
    volumeDiario: 147
  }
};

export function AdvancedReports() {
  const [data, setData] = useState<ReportData>(mockData);
  const [dateRange, setDateRange] = useState<any>(null);
  const [selectedChannel, setSelectedChannel] = useState('todos');
  const [reportType, setReportType] = useState('geral');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const refreshData = async () => {
    setLoading(true);
    // Simular carregamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    setData(mockData);
    setLoading(false);
    toast({
      title: "Dados atualizados",
      description: "Relatório atualizado com sucesso",
    });
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Cabeçalho
    doc.setFontSize(20);
    doc.text('Relatório de Atendimento', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Período: ${dateRange ? 'Personalizado' : 'Últimos 30 dias'}`, 20, 35);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 45);

    // Métricas principais
    doc.setFontSize(16);
    doc.text('Métricas Principais', 20, 65);
    
    const metricsData = [
      ['Total de Atendimentos', data.atendimentos.total.toString()],
      ['Atendimentos Resolvidos', data.atendimentos.resolvidos.toString()],
      ['Tempo Médio de Atendimento', data.atendimentos.tempoMedio],
      ['Taxa de Resolução', `${data.metricas.taxaResolucao}%`],
      ['NPS', data.metricas.nps.toString()],
      ['Satisfação Média', data.atendimentos.satisfacao.toString()]
    ];

    autoTable(doc, {
      startY: 75,
      head: [['Métrica', 'Valor']],
      body: metricsData,
      theme: 'grid'
    });

    // Produtividade dos agentes
    doc.addPage();
    doc.setFontSize(16);
    doc.text('Produtividade dos Agentes', 20, 20);

    const agentData = data.agentes.produtividade.map(agent => [
      agent.nome,
      agent.atendimentos.toString(),
      agent.tempo,
      agent.satisfacao.toString()
    ]);

    autoTable(doc, {
      startY: 30,
      head: [['Nome', 'Atendimentos', 'Tempo Médio', 'Satisfação']],
      body: agentData,
      theme: 'grid'
    });

    doc.save('relatorio-atendimento.pdf');
    
    toast({
      title: "PDF gerado",
      description: "Relatório exportado em PDF com sucesso",
    });
  };

  const exportToExcel = () => {
    // Criar workbook
    const wb = XLSX.utils.book_new();

    // Planilha de métricas
    const metricsWS = XLSX.utils.aoa_to_sheet([
      ['Relatório de Atendimento'],
      [''],
      ['Métrica', 'Valor'],
      ['Total de Atendimentos', data.atendimentos.total],
      ['Atendimentos Resolvidos', data.atendimentos.resolvidos],
      ['Atendimentos Pendentes', data.atendimentos.pendentes],
      ['Tempo Médio', data.atendimentos.tempoMedio],
      ['Taxa de Resolução', `${data.metricas.taxaResolucao}%`],
      ['NPS', data.metricas.nps],
      ['Satisfação Média', data.atendimentos.satisfacao]
    ]);

    // Planilha de agentes
    const agentHeaders = ['Nome', 'Atendimentos', 'Tempo Médio', 'Satisfação'];
    const agentRows = data.agentes.produtividade.map(agent => [
      agent.nome,
      agent.atendimentos,
      agent.tempo,
      agent.satisfacao
    ]);
    const agentsWS = XLSX.utils.aoa_to_sheet([agentHeaders, ...agentRows]);

    // Planilha de volume por hora
    const hoursHeaders = ['Hora', 'Volume'];
    const hoursRows = data.horarios.map(h => [h.hora, h.volume]);
    const hoursWS = XLSX.utils.aoa_to_sheet([hoursHeaders, ...hoursRows]);

    // Adicionar planilhas
    XLSX.utils.book_append_sheet(wb, metricsWS, 'Métricas');
    XLSX.utils.book_append_sheet(wb, agentsWS, 'Agentes');
    XLSX.utils.book_append_sheet(wb, hoursWS, 'Volume por Hora');

    // Salvar arquivo
    XLSX.writeFile(wb, 'relatorio-atendimento.xlsx');
    
    toast({
      title: "Excel gerado",
      description: "Relatório exportado em Excel com sucesso",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header com controles */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Relatórios Avançados</h2>
          <p className="text-muted-foreground">
            Análises detalhadas e exportação de dados de atendimento
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button onClick={exportToPDF}>
            <FileText className="h-4 w-4 mr-2" />
            PDF
          </Button>
          <Button onClick={exportToExcel}>
            <Table className="h-4 w-4 mr-2" />
            Excel
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Período</Label>
              <DatePickerWithRange 
                date={dateRange}
                onDateChange={setDateRange}
              />
            </div>
            <div>
              <Label>Canal</Label>
              <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os canais</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="chat">Chat Interno</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tipo de Relatório</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="geral">Relatório Geral</SelectItem>
                  <SelectItem value="agentes">Produtividade</SelectItem>
                  <SelectItem value="satisfacao">Satisfação</SelectItem>
                  <SelectItem value="tempo">Tempo de Resposta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="w-full">
                Aplicar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas principais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{data.atendimentos.total}</p>
              </div>
              <MessageCircle className="h-8 w-8 text-blue-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+12.5%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resolvidos</p>
                <p className="text-2xl font-bold">{data.atendimentos.resolvidos}</p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">{data.metricas.taxaResolucao}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tempo Médio</p>
                <p className="text-2xl font-bold">{data.atendimentos.tempoMedio}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">-8.2%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">NPS</p>
                <p className="text-2xl font-bold">{data.metricas.nps}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+0.3</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="geral" className="space-y-4">
        <TabsList>
          <TabsTrigger value="geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="agentes">Agentes</TabsTrigger>
          <TabsTrigger value="canais">Canais</TabsTrigger>
          <TabsTrigger value="horarios">Volume por Hora</TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Canal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>WhatsApp</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-blue-100 rounded">
                        <div className="w-20 h-2 bg-blue-500 rounded"></div>
                      </div>
                      <span className="text-sm font-medium">{data.canais.whatsapp}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Chat Interno</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-green-100 rounded">
                        <div className="w-12 h-2 bg-green-500 rounded"></div>
                      </div>
                      <span className="text-sm font-medium">{data.canais.chatInterno}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Email</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-purple-100 rounded">
                        <div className="w-6 h-2 bg-purple-500 rounded"></div>
                      </div>
                      <span className="text-sm font-medium">{data.canais.email}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status dos Atendimentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Resolvidos</span>
                    <Badge className="bg-green-100 text-green-800">
                      {data.atendimentos.resolvidos}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Pendentes</span>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      {data.atendimentos.pendentes}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxa de Resolução</span>
                    <Badge className="bg-blue-100 text-blue-800">
                      {data.metricas.taxaResolucao}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="agentes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Produtividade dos Agentes</CardTitle>
              <CardDescription>
                Performance individual e métricas de qualidade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.agentes.produtividade.map((agent, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{agent.nome}</p>
                        <p className="text-sm text-muted-foreground">
                          Tempo médio: {agent.tempo}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{agent.atendimentos}</p>
                        <p className="text-xs text-muted-foreground">Atendimentos</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">{agent.satisfacao}</p>
                        <p className="text-xs text-muted-foreground">Satisfação</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="canais" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">WhatsApp</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {data.canais.whatsapp}
                </div>
                <p className="text-sm text-muted-foreground">
                  {((data.canais.whatsapp / data.atendimentos.total) * 100).toFixed(1)}% do total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Chat Interno</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {data.canais.chatInterno}
                </div>
                <p className="text-sm text-muted-foreground">
                  {((data.canais.chatInterno / data.atendimentos.total) * 100).toFixed(1)}% do total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Email</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {data.canais.email}
                </div>
                <p className="text-sm text-muted-foreground">
                  {((data.canais.email / data.atendimentos.total) * 100).toFixed(1)}% do total
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="horarios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Volume de Atendimentos por Hora</CardTitle>
              <CardDescription>
                Distribuição temporal dos atendimentos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.horarios.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <span className="w-16 text-sm font-medium">{item.hora}</span>
                    <div className="flex-1 h-6 bg-gray-100 rounded">
                      <div 
                        className="h-6 bg-blue-500 rounded"
                        style={{ width: `${(item.volume / 156) * 100}%` }}
                      ></div>
                    </div>
                    <span className="w-12 text-sm font-medium text-right">{item.volume}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}