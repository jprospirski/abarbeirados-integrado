import { DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';

import { Servico } from '../../core/models/servico.model';

/** Lista de servicos com busca por nome. Consome GET /api/servicos. */
@Component({
  selector: 'app-servico',
  imports: [DecimalPipe],
  templateUrl: './servico.component.html',
  styleUrl: './servico.component.scss',
})
export class ServicoComponent implements OnInit {
  private readonly http = inject(HttpClient);
  // O proxy.conf.json manda /api para a 8080, entao nao ha CORS em `ng serve`.
  private readonly apiUrl = '/api/servicos';

  servicos: Servico[] = [];
  busca = '';
  carregando = true;
  erro = '';

  get servicosFiltrados(): Servico[] {
    const termo = this.busca.trim().toLowerCase();
    return termo
      ? this.servicos.filter((servico) =>
          servico.nome.toLowerCase().includes(termo),
        )
      : this.servicos;
  }

  ngOnInit(): void {
    this.http.get<Servico[]>(this.apiUrl).subscribe({
      next: (servicos) => {
        this.servicos = servicos;
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Não foi possível carregar os serviços.';
        this.carregando = false;
      },
    });
  }

  atualizarBusca(event: Event): void {
    this.busca = (event.target as HTMLInputElement).value;
  }
}
