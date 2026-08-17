package uniamerica.abarbeirados.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
// Singular, como `servico` e `agendamento`: uma linha e um cliente. O nome da
// tabela nao acompanha o da rota /api/clientes — la o plural e a colecao.
@Table(name = "cliente")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    private String email;

    @Column(nullable = false)
    private String telefone;

    @Column(name = "data_cadastro", nullable = false, updatable = false)
    private LocalDateTime dataCadastro;

    @PrePersist
    public void posCadastro() {
        this.dataCadastro = LocalDateTime.now();
    }
}