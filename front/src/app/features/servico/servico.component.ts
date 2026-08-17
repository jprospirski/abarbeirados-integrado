import { CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';

import { Servico } from '../../core/models/servico.model';

/**
 * A duracao escrita por extenso e calculada uma vez na chegada, e nao no
 * template, para nao recalcular a cada ciclo de deteccao de mudanca.
 */
interface ServicoCartao extends Servico {
  duracaoRotulo: string;
}

/** Formata 40 como "40 min", 60 como "1h" e 80 como "1h20". */
function formatarDuracao(minutos: number): string {
  if (minutos < 60) {
    return `${minutos} min`;
  }

  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;

  return resto === 0 ? `${horas}h` : `${horas}h${String(resto).padStart(2, '0')}`;
}

function paraCartao(servico: Servico): ServicoCartao {
  return {
    ...servico,
    duracaoRotulo: formatarDuracao(servico.duracaoMinutos),
  };
}

/** Catalogo de servicos. Consome GET /api/servicos. */
@Component({
  selector: 'app-servico',
  imports: [CurrencyPipe],
  templateUrl: './servico.component.html',
  styleUrl: './servico.component.scss',
})
export class ServicoComponent implements OnInit {
  private readonly http = inject(HttpClient);
  // O proxy.conf.json manda /api para a 8080, entao nao ha CORS em `ng serve`.
  private readonly apiUrl = '/api/servicos';

  protected readonly servicos = signal<ServicoCartao[]>([]);
  protected readonly busca = signal('');
  protected readonly carregando = signal(true);
  protected readonly erro = signal('');
  /** Espelha o ?apenasAtivos= do endpoint. */
  protected readonly apenasAtivos = signal(false);

  /*
   * A busca por nome fica no cliente: o catalogo e curto e filtrar local evita
   * uma requisicao por tecla digitada. Ja o recorte de ativos vai ao servidor,
   * porque e o proprio endpoint que sabe a regra.
   */
  protected readonly servicosFiltrados = computed(() => {
    const termo = this.busca().trim().toLowerCase();

    return termo
      ? this.servicos().filter((servico) => servico.nome.toLowerCase().includes(termo))
      : this.servicos();
  });

  /** Rodape do cabecalho: quantos ao todo e quantos ativos. */
  protected readonly resumo = computed(() => {
    const lista = this.servicosFiltrados();

    if (lista.length === 0) {
      return null;
    }

    return {
      total: lista.length,
      ativos: lista.filter((servico) => servico.ativo).length,
    };
  });

  ngOnInit(): void {
    this.carregar();
  }

  protected definirEscopo(apenasAtivos: boolean): void {
    if (this.apenasAtivos() === apenasAtivos) {
      return;
    }

    this.apenasAtivos.set(apenasAtivos);
    this.carregar();
  }

  protected atualizarBusca(event: Event): void {
    this.busca.set((event.target as HTMLInputElement).value);
  }

  private carregar(): void {
    this.carregando.set(true);
    this.erro.set('');

    const url = this.apenasAtivos() ? `${this.apiUrl}?apenasAtivos=true` : this.apiUrl;

    this.http.get<Servico[]>(url).subscribe({
      next: (servicos) => {
        this.servicos.set(servicos.map(paraCartao));
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar os serviços.');
        this.carregando.set(false);
      },
    });
  }
}
