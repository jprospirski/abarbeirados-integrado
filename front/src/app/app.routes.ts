import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'agendamentos' },
  {
    path: 'agendamentos',
    title: 'Agendamentos | Abarbeirados',
    loadComponent: () =>
      import('./features/agenda/agenda.component').then((m) => m.AgendaComponent),
  },
  {
    path: 'agendamentos/novo',
    title: 'Novo agendamento | Abarbeirados',
    loadComponent: () =>
      import('./features/agendamento/agendamento.component').then(
        (m) => m.AgendamentoComponent,
      ),
  },
  {
    path: 'servicos',
    title: 'Serviços | Abarbeirados',
    loadComponent: () =>
      import('./features/servico/servico.component').then(
        (m) => m.ServicoComponent,
      ),
  },
  // TODO: rota 'clientes' — a terceira tela da entrega, ainda não desenvolvida.
  { path: '**', redirectTo: 'agendamentos' },
];
