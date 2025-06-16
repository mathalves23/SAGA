package com.hevyclone.app.auth.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class AuthTokenFilter extends OncePerRequestFilter {
    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    private static final Logger logger = LoggerFactory.getLogger(AuthTokenFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) 
            throws ServletException, IOException {
        logger.debug("AuthTokenFilter: Iniciando doFilterInternal para a requisição: {}", request.getRequestURI());
        try {
            String jwt = parseJwt(request);
            if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
                String username = jwtUtils.getUserNameFromJwtToken(jwt);
                logger.debug("AuthTokenFilter: Token JWT válido encontrado para o usuário: {}", username);

                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null,
                        userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
                logger.debug("AuthTokenFilter: Autenticação definida no SecurityContext para o usuário: {}", username);
            } else {
                logger.debug("AuthTokenFilter: Nenhum token JWT válido encontrado na requisição.");
            }
        } catch (Exception e) {
            logger.error("AuthTokenFilter: Não foi possível definir a autenticação do usuário: {}", e.getMessage(), e);
        }

        filterChain.doFilter(request, response);
        logger.debug("AuthTokenFilter: Finalizando doFilterInternal para a requisição: {}", request.getRequestURI());
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        logger.debug("AuthTokenFilter: Cabeçalho de autorização: {}", headerAuth);

        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            String jwtToken = headerAuth.substring(7);
            logger.debug("AuthTokenFilter: Token JWT extraído: {}", jwtToken);
            return jwtToken;
        }
        logger.debug("AuthTokenFilter: Nenhum token Bearer encontrado no cabeçalho de autorização.");
        return null;
    }
}

