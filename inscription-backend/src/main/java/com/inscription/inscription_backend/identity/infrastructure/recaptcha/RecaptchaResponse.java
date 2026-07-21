package com.inscription.inscription_backend.identity.infrastructure.recaptcha;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record RecaptchaResponse(
        boolean success,
        String challenge_ts,
        String hostname,
        List<String> errorCodes
) {}