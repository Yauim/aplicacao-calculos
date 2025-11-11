package com.empresa.aplicacao.config;

import com.empresa.aplicacao.security.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	private final JwtFilter jwtFilter;

	public SecurityConfig(JwtFilter jwtFilter) {
		this.jwtFilter = jwtFilter;
	}

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http, CorsConfigurationSource corsConfigurationSource) throws Exception {
		http
				.cors(cors -> cors.configurationSource(corsConfigurationSource))
				.csrf(csrf -> csrf.disable())
				.authorizeHttpRequests(auth -> auth
						// ✅ Libera autenticação Google (sem exigir JWT)
						.requestMatchers("/auth/**").permitAll()

						// ✅ Libera os endpoints da aplicação durante o desenvolvimento
						.requestMatchers("/api/**").permitAll()

						// (opcional) mantenha essas linhas para permitir rotas públicas futuras
						.requestMatchers("/public/**").permitAll()

						// 🔒 Caso queira exigir JWT em rotas específicas no futuro
						// .requestMatchers("/api/financeiro/**").authenticated()

						// ✅ Tudo o resto é liberado (útil em ambiente dev)
						.anyRequest().permitAll()
				)
				.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOrigins(List.of(
				"http://localhost:5177",
				"http://127.0.0.1:5177"
		));
		configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		configuration.setAllowedHeaders(List.of("*"));
		configuration.setExposedHeaders(List.of("Authorization"));
		configuration.setAllowCredentials(true);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}
}
