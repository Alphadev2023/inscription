package com.inscription.inscription_backend.inscription.domain.model;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.*;

class ScoreCompleteTest {

    @Test
    @DisplayName("Score 0 n'est pas suffisant pour soumission")
    void scoreZeroInsuffisant() {
        ScoreCompletude score = ScoreCompletude.de(0);
        assertThat(score.estSuffisantPourSoumission()).isFalse();
    }

    @Test
    @DisplayName("Score 80 est suffisant pour soumission")
    void score80Suffisant() {
        ScoreCompletude score = ScoreCompletude.de(80);
        assertThat(score.estSuffisantPourSoumission()).isTrue();
    }

    @Test
    @DisplayName("Score 100 est valide")
    void score100Valide() {
        ScoreCompletude score = ScoreCompletude.de(100);
        assertThat(score.getValeur()).isEqualTo(100);
        assertThat(score.estSuffisantPourSoumission()).isTrue();
    }

    @Test
    @DisplayName("Score négatif lance une exception")
    void scoreNegatifInvalide() {
        assertThatThrownBy(() -> ScoreCompletude.de(-1))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("Score supérieur à 100 lance une exception")
    void scoreSup100Invalide() {
        assertThatThrownBy(() -> ScoreCompletude.de(101))
                .isInstanceOf(IllegalArgumentException.class);
    }
}