package uniamerica.abarbeirados.mapper;

import uniamerica.abarbeirados.dto.agendamento.AgendamentoRequest;
import uniamerica.abarbeirados.dto.agendamento.AgendamentoResponse;
import uniamerica.abarbeirados.model.Agendamento;
import uniamerica.abarbeirados.model.Cliente;
import uniamerica.abarbeirados.model.Servico;
import uniamerica.abarbeirados.model.StatusAgendamento;

public class AgendamentoMapper {

    private AgendamentoMapper() {
    }

    /*
     * Cliente e Servico chegam prontos: quem resolve os ids e o service, que e a
     * camada com acesso aos repositorios.
     */
    public static Agendamento toEntity(AgendamentoRequest request, Cliente cliente, Servico servico) {
        Agendamento agendamento = new Agendamento();
        agendamento.setCliente(cliente);
        agendamento.setServico(servico);
        agendamento.setDataHora(request.dataHora());
        agendamento.setObservacoes(request.observacoes());
        agendamento.setStatus(StatusAgendamento.AGENDADO);
        agendamento.setValor(servico.getValor());
        agendamento.setDuracaoMinutos(servico.getDuracaoMinutos());
        return agendamento;
    }

    public static void updateEntity(Agendamento existing, AgendamentoRequest request, Cliente cliente, Servico servico) {
        existing.setCliente(cliente);
        existing.setServico(servico);
        existing.setDataHora(request.dataHora());
        existing.setObservacoes(request.observacoes());
        existing.setValor(servico.getValor());
        existing.setDuracaoMinutos(servico.getDuracaoMinutos());
    }

    public static AgendamentoResponse toResponse(Agendamento agendamento) {
        Cliente cliente = agendamento.getCliente();
        Servico servico = agendamento.getServico();

        return new AgendamentoResponse(
                agendamento.getId(),
                cliente.getId(),
                cliente.getNome(),
                cliente.getTelefone(),
                servico.getId(),
                servico.getNome(),
                agendamento.getValor(),
                agendamento.getDuracaoMinutos(),
                agendamento.getDataHora(),
                agendamento.getStatus(),
                agendamento.getObservacoes()
        );
    }
}
