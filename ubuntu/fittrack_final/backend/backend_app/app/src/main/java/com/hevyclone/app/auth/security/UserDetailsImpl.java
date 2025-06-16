package com.hevyclone.app.auth.security;

import java.io.Serializable;
import java.util.Collection;
import java.util.Collections; // Import Collections

import com.hevyclone.app.user.model.User;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority; // Import SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails;


public class UserDetailsImpl implements UserDetails, Serializable {

    private static final long serialVersionUID = 1L; // Added serialVersionUID for Serializable

    private Long id;
    private String username;
    private String password;
    private String email;

    public UserDetailsImpl(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.password = user.getPassword();
        this.email = user.getEmail();
    }

    public Long getId() {
        return id;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Atribuindo a role "ROLE_USER" por padrão para todos os usuários autenticados.
        // Idealmente, isso viria de um campo/relação no modelo User.
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}

