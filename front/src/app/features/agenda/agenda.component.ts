import { CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import {
  Agendamento,
  STATUS_LABEL,
  StatusAgendamento,
} from '../../core/models/agendamento.model';
import { AgendamentoService } from '../../core/services/agendamento.service';
import { dataDe, horaDe } from '../../core/util/data.util';

/** As três formas de olhar a mesma lista. */
type Visao = 'cartoes' | 'lista' | 'colunas';

/** Ordem em que os status aparecem no quadro de colunas. */
const STATUS: StatusAgendamento[] = [
  'AGENDADO',
  'CONFIRMADO',
  'CONCLUIDO',
  'CANCELADO',
];

/** 2026-08-18T09:00:00 vira 18/08. */
function diaCurto(dataHora: string): string {
  const [, mes, dia] = dataDe(dataHora).split('-');
  return `${dia}/${mes}`;
}

@Component({
  selector: 'app-agenda',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './agenda.component.html',
  styleUrl: './agenda.component.scss',
})
export class AgendaComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  protected readonly service = inject(AgendamentoService);

  protected readonly STATUS = STATUS;
  protected readonly STATUS_LABEL = STATUS_LABEL;

  protected readonly visao = signal<Visao>('cartoes');
  protected readonly busca = signal('');
  protected readonly erro = signal<string | null>(null);
  /** Id em gravação, para travar só a linha que está mudando. */
  protected readonly salvandoId = signal<number | null>(null);

  /** Ordenados por data e hora, com os campos de exibição já prontos. */
  protected readonly agendamentos = computed(() => {
    const termo = this.busca().trim().toLowerCase();

    return this.service
      .agendamentos()
      .filter(
        (a) =>
          !termo ||
          a.clienteNome.toLowerCase().includes(termo) ||
          a.servicoNome.toLowerCase().includes(termo),
      )
      .map((a) => ({
        ...a,
        dia: diaCurto(a.dataHora),
        hora: horaDe(a.dataHora),
      }))
      .sort((a, b) => a.dataHora.localeCompare(b.dataHora));
  });

  /** Uma lista por status, para o quadro de colunas. */
  protected readonly porStatus = computed(() => {
    const lista = this.agendamentos();

    return STATUS.map((status) => ({
      status,
      rotulo: STATUS_LABEL[status],
      itens: lista.filter((a) => a.status === status),
    }));
  });

  protected readonly resumo = computed(() => {
    const lista = this.agendamentos();

    return {
      total: lista.length,
      ativos: lista.filter((a) => a.status !== 'CANCELADO').length,
    };
  });

  ngOnInit(): void {
    this.service.carregar();
  }

  protected definirVisao(visao: Visao): void {
    this.visao.set(visao);
  }

  protected atualizarBusca(evento: Event): void {
    this.busca.set((evento.target as HTMLInputElement).value);
  }

  protected mudarStatus(agendamento: Agendamento, evento: Event): void {
    const status = (evento.target as HTMLSelectElement).value as StatusAgendamento;

    if (status === agendamento.status) {
      return;
    }

    this.erro.set(null);
    this.salvandoId.set(agendamento.id);

    this.service
      .atualizarStatus(agendamento.id, status)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.salvandoId.set(null),
        error: (e: unknown) => {
          this.erro.set(
            e instanceof Error ? e.message : 'Não foi possível alterar o status.',
          );
          this.salvandoId.set(null);
          // A lista não mudou, mas o <select> já está mostrando a opção nova.
          // Recarrega para o que aparece na tela voltar a ser o que está no banco.
          this.service.carregar(true);
        },
      });
  }
}
