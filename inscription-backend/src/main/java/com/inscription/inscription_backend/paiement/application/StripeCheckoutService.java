package com.inscription.inscription_backend.paiement.application;

import com.inscription.inscription_backend.paiement.domain.Paiement;
import com.inscription.inscription_backend.paiement.infrastructure.PaiementRepository;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class StripeCheckoutService {

    private final PaiementRepository paiementRepository;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public StripeCheckoutService(PaiementRepository paiementRepository) {
        this.paiementRepository = paiementRepository;
    }

    public String creerSessionPaiement(UUID inscriptionId, BigDecimal montant, String libelle) throws Exception {
        Paiement paiement = new Paiement(inscriptionId, montant);
        paiement = paiementRepository.save(paiement);

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(frontendUrl + "/paiement/succes?session_id={CHECKOUT_SESSION_ID}")
                .setCancelUrl(frontendUrl + "/paiement/annule")
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity(1L)
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency("xof")
                                                .setUnitAmount(montant.longValue())
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName(libelle)
                                                                .build()
                                                )
                                                .build()
                                )
                                .build()
                )
                .putMetadata("inscriptionId", inscriptionId.toString())
                .putMetadata("paiementId", paiement.getId().toString())
                .build();

        Session session = Session.create(params);
        paiement.attacherSessionStripe(session.getId());
        paiementRepository.save(paiement);

        return session.getUrl();
    }
}