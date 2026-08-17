package uniamerica.abarbeirados.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uniamerica.abarbeirados.dto.agendamento.AgendaDoDiaResponse;
import uniamerica.abarbeirados.dto.agendamento.AgendamentoRequest;
import uniamerica.abarbeirados.dto.agendamento.AgendamentoResponse;
import uniamerica.abarbeirados.dto.agendamento.AtualizarStatusRequest;
import uniamerica.abarbeirados.exception.ResourceNotFoundException;
import uniamerica.abarbeirados.mapper.AgendamentoMapper;
import uniamerica.abarbeirados.model.Agendamento;
import uniamerica.abarbeirados.model.Cliente;
import uniamerica.abarbeirados.model.Servico;
import uniamerica.abarbeirados.repository.AgendamentoRepository;
import uniamerica.abarbeirados.repository.ClienteRepository;
import uniamerica.abarbeirados.repository.ServicoRepository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AgendamentoService {

    private final AgendamentoRepository agendamentoRepository;
    private final ClienteRepository clienteRepository;
    private final ServicoRepository servicoRepository;

    @Transactional
    public Agendamento save(AgendamentoRequest request) {
        Cliente cliente = buscarCliente(request.clienteId());
        Servico servico = buscarServico(request.servicoId());

        Agendamento agendamento = AgendamentoMapper.toEntity(request, cliente, servico);
        return agendamentoRepository.save(agendamento);
    }

    public Agendamento findById(Long id) {
        return agendamentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agendamento não encontrado com id: " + id));
    }

    public List<Agendamento> findAll(String busca, LocalDate data) {
        List<Agendamento> todos = agendamentoRepository.findAll();
        List<Agendamento> resultado = new ArrayList<>();

        for (Agendamento a : todos) {
            boolean passaBusca = busca == null || busca.isBlank()
                    || a.getCliente().getNome().toLowerCase().contains(busca.toLowerCase())
                    || a.getServico().getNome().toLowerCase().contains(busca.toLowerCase());

            boolean passaData = data == null || a.getDataHora().toLocalDate().equals(data);

            if (passaBusca && passaData) {
                resultado.add(a);
            }
        }

        resultado.sort(Comparator.comparing(Agendamento::getDataHora));
        return resultado;
    }

    public List<AgendaDoDiaResponse> getAgendaAgrupadaPorDia() {
        List<Agendamento> agendamentos = agendamentoRepository.findAll();

        // Agrupa manualmente os agendamentos por dia
        Map<LocalDate, List<AgendamentoResponse>> agrupado = new LinkedHashMap<>();

        for (Agendamento a : agendamentos) {
            LocalDate dia = a.getDataHora().toLocalDate();

            if (!agrupado.containsKey(dia)) {
                agrupado.put(dia, new ArrayList<>());
            }
            agrupado.get(dia).add(AgendamentoMapper.toResponse(a));
        }

        // Monta a lista final de AgendaDoDiaResponse a partir do mapa agrupado
        List<AgendaDoDiaResponse> resultado = new ArrayList<>();
        for (Map.Entry<LocalDate, List<AgendamentoResponse>> entry : agrupado.entrySet()) {
            resultado.add(new AgendaDoDiaResponse(entry.getKey(), entry.getValue()));
        }

        resultado.sort(Comparator.comparing(AgendaDoDiaResponse::getDia));
        return resultado;
    }

    @Transactional
    public Agendamento update(Long id, AgendamentoRequest request) {
        Agendamento existing = findById(id);
        Cliente cliente = buscarCliente(request.clienteId());
        Servico servico = buscarServico(request.servicoId());

        AgendamentoMapper.updateEntity(existing, request, cliente, servico);
        return agendamentoRepository.save(existing);
    }

    @Transactional
    public Agendamento updateStatus(Long id, AtualizarStatusRequest request) {
        Agendamento existing = findById(id);

        existing.setStatus(request.getStatus());
        return agendamentoRepository.save(existing);
    }

    @Transactional
    public void deleteById(Long id) {
        if (!agendamentoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Agendamento não encontrado com id: " + id);
        }
        agendamentoRepository.deleteById(id);
    }

    private Cliente buscarCliente(Long id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com id: " + id));
    }

    private Servico buscarServico(Long id) {
        return servicoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Serviço não encontrado com id: " + id));
    }
}
