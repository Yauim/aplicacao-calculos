package com.empresa.aplicacao_calculos.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

	private final Key chave = Keys.secretKeyFor(SignatureAlgorithm.HS256);

	public String gerarToken(String email) {
		return Jwts.builder()
				.setSubject(email)
				.setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 dia
				.signWith(chave)
				.compact();
	}

	public String validarToken(String token) {
		return Jwts.parserBuilder()
				.setSigningKey(chave)
				.build()
				.parseClaimsJws(token)
				.getBody()
				.getSubject();
	}
}
