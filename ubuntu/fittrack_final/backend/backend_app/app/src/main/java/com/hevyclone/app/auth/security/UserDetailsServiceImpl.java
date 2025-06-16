package com.hevyclone.app.auth.security;

import com.hevyclone.app.user.model.User;
import com.hevyclone.app.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(UserDetailsServiceImpl.class);

    @Autowired
    UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        logger.debug("Tentando carregar usuário pelo nome: {}", username);
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> {
                    logger.warn("Usuário não encontrado com o nome de usuário: {}", username);
                    return new UsernameNotFoundException("Usuário não encontrado: " + username);
                });

        logger.debug("Usuário encontrado: {}. Senha (codificada): {}", user.getUsername(), user.getPassword());

        return new UserDetailsImpl(user);
    }
}
