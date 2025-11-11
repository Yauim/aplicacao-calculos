package com.empresa.aplicacao.controllers;

import com.empresa.aplicacao.security.JwtUtil;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class GoogleAuthController {

    private final JwtUtil jwtUtil;

    @Value("${google.clientId}")
    private String clientId;

    public GoogleAuthController(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/google")
    public ResponseEntity<Map<String, String>> loginComGoogle(@RequestBody Map<String, String> body)
            throws GeneralSecurityException, IOException {

        String tokenId = body.get("token");
        if (tokenId == null) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Token Google ausente"));
        }

        var verifier = new GoogleIdTokenVerifier.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                JacksonFactory.getDefaultInstance()
        ).setAudience(Collections.singletonList(clientId)).build();

        GoogleIdToken idToken = verifier.verify(tokenId);
        if (idToken == null) {
            return ResponseEntity.status(401).body(Map.of("erro", "Token Google inválido"));
        }

        GoogleIdToken.Payload payload = idToken.getPayload();
        String email = payload.getEmail();
        String nome = (String) payload.get("name");

        // ✅ Gera JWT local
        String jwt = jwtUtil.gerarToken(email);

        return ResponseEntity.ok(Map.of(
                "jwt", jwt,
                "email", email,
                "nome", nome
        ));
    }
}
