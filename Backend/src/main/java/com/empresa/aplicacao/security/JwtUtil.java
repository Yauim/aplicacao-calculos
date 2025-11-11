package com.empresa.aplicacao_calculos.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

	private final String SECRET = "segredo_super_secreto";
	private final long EXPIRACAO = 1000 * 60 * 60 * 24; // 24 horas

	public String gerarToken(String email) {
		return Jwts.builder()
				.setSubject(email)
				.setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + EXPIRACAO))
				.signWith(SignatureAlgorithm.HS256, SECRET.getBytes())
				.compact();
	}

	public String validarToken(String token) {
		return Jwts.parser()
				.setSigningKey(SECRET.getBytes())
				.parseClaimsJws(token)
				.getBody()
				.getSubject();
	}
}
