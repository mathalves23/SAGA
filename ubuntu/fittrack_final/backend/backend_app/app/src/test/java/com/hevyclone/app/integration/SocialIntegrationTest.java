package com.hevyclone.app.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hevyclone.app.HevycloneAppApplication;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

@SpringBootTest(classes = HevycloneAppApplication.class)
@AutoConfigureWebMvc
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@Transactional
class SocialIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String user1Token;
    private String user2Token;
    private String user3Token;
    private String user1Id;
    private String user2Id;
    private String user3Id;

    @BeforeEach
    void setUp() throws Exception {
        // Criar três usuários para testes sociais
        String[] userEmails = {"social1@teste.com", "social2@teste.com", "social3@teste.com"};
        String[] userNames = {"Usuário Social 1", "Usuário Social 2", "Usuário Social 3"};
        String[] tokens = new String[3];
        String[] userIds = new String[3];

        for (int i = 0; i < 3; i++) {
            Map<String, Object> userData = new HashMap<>();
            userData.put("name", userNames[i]);
            userData.put("email", userEmails[i]);
            userData.put("password", "senha123");

            MvcResult authResult = mockMvc.perform(post("/api/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(userData)))
                    .andExpect(status().isCreated())
                    .andReturn();

            String authResponse = authResult.getResponse().getContentAsString();
            Map<String, Object> authJson = objectMapper.readValue(authResponse, Map.class);
            tokens[i] = (String) authJson.get("token");
            
            Map<String, Object> user = (Map<String, Object>) authJson.get("user");
            userIds[i] = user.get("id").toString();
        }

        user1Token = tokens[0];
        user2Token = tokens[1];
        user3Token = tokens[2];
        user1Id = userIds[0];
        user2Id = userIds[1];
        user3Id = userIds[2];
    }

    @Test
    @Order(1)
    void deveRealizarFluxoCompletoDeSeguidores() throws Exception {
        // User1 segue User2
        mockMvc.perform(post("/api/users/{userId}/follow", user2Id)
                .header("Authorization", "Bearer " + user1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.following").value(true))
                .andExpect(jsonPath("$.message").value("Usuário seguido com sucesso"));

        // User1 segue User3
        mockMvc.perform(post("/api/users/{userId}/follow", user3Id)
                .header("Authorization", "Bearer " + user1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.following").value(true));

        // User2 segue User1 (seguir de volta)
        mockMvc.perform(post("/api/users/{userId}/follow", user1Id)
                .header("Authorization", "Bearer " + user2Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.following").value(true));

        // Verificar contadores de User1 (segue 2, seguido por 1)
        mockMvc.perform(get("/api/users/{userId}/profile", user1Id)
                .header("Authorization", "Bearer " + user1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.followingCount").value(2))
                .andExpect(jsonPath("$.followersCount").value(1));

        // Verificar contadores de User2 (segue 1, seguido por 1)
        mockMvc.perform(get("/api/users/{userId}/profile", user2Id)
                .header("Authorization", "Bearer " + user2Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.followingCount").value(1))
                .andExpect(jsonPath("$.followersCount").value(1));

        // Listar seguidores de User1
        mockMvc.perform(get("/api/users/{userId}/followers", user1Id)
                .header("Authorization", "Bearer " + user1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].name").value("Usuário Social 2"));

        // Listar seguindo de User1
        mockMvc.perform(get("/api/users/{userId}/following", user1Id)
                .header("Authorization", "Bearer " + user1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(2)));

        // User1 para de seguir User3
        mockMvc.perform(delete("/api/users/{userId}/follow", user3Id)
                .header("Authorization", "Bearer " + user1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.following").value(false))
                .andExpect(jsonPath("$.message").value("Deixou de seguir o usuário"));

        // Verificar contadores atualizados de User1
        mockMvc.perform(get("/api/users/{userId}/profile", user1Id)
                .header("Authorization", "Bearer " + user1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.followingCount").value(1))
                .andExpect(jsonPath("$.followersCount").value(1));
    }

    @Test
    @Order(2)
    void deveCriarEGerenciarPostsNoFeed() throws Exception {
        // User1 cria um post
        Map<String, Object> postData = new HashMap<>();
        postData.put("content", "Acabei de finalizar um treino incrível! 💪");
        postData.put("type", "TEXT");
        postData.put("public", true);

        MvcResult postResult = mockMvc.perform(post("/api/posts")
                .header("Authorization", "Bearer " + user1Token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(postData)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.content").value("Acabei de finalizar um treino incrível! 💪"))
                .andExpect(jsonPath("$.author.name").value("Usuário Social 1"))
                .andExpect(jsonPath("$.likesCount").value(0))
                .andExpect(jsonPath("$.commentsCount").value(0))
                .andReturn();

        String postResponse = postResult.getResponse().getContentAsString();
        Map<String, Object> postJson = objectMapper.readValue(postResponse, Map.class);
        String postId = postJson.get("id").toString();

        // User2 curte o post
        mockMvc.perform(post("/api/posts/{postId}/like", postId)
                .header("Authorization", "Bearer " + user2Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.liked").value(true))
                .andExpect(jsonPath("$.likesCount").value(1));

        // User3 também curte o post
        mockMvc.perform(post("/api/posts/{postId}/like", postId)
                .header("Authorization", "Bearer " + user3Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.liked").value(true))
                .andExpect(jsonPath("$.likesCount").value(2));

        // User2 comenta no post
        Map<String, Object> commentData = new HashMap<>();
        commentData.put("text", "Parabéns! Que treino foi esse?");

        mockMvc.perform(post("/api/posts/{postId}/comments", postId)
                .header("Authorization", "Bearer " + user2Token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(commentData)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.text").value("Parabéns! Que treino foi esse?"))
                .andExpect(jsonPath("$.author.name").value("Usuário Social 2"));

        // User3 também comenta
        Map<String, Object> comment2Data = new HashMap<>();
        comment2Data.put("text", "Inspirador! 🔥");

        mockMvc.perform(post("/api/posts/{postId}/comments", postId)
                .header("Authorization", "Bearer " + user3Token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(comment2Data)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.text").value("Inspirador! 🔥"));

        // Verificar post com likes e comentários
        mockMvc.perform(get("/api/posts/{postId}", postId)
                .header("Authorization", "Bearer " + user1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.likesCount").value(2))
                .andExpect(jsonPath("$.commentsCount").value(2))
                .andExpect(jsonPath("$.comments", hasSize(2)));

        // User2 descurte o post
        mockMvc.perform(delete("/api/posts/{postId}/like", postId)
                .header("Authorization", "Bearer " + user2Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.liked").value(false))
                .andExpect(jsonPath("$.likesCount").value(1));
    }

    @Test
    @Order(3)
    void deveGerarFeedPersonalizado() throws Exception {
        // Estabelecer conexões: User1 segue User2, User2 segue User3
        mockMvc.perform(post("/api/users/{userId}/follow", user2Id)
                .header("Authorization", "Bearer " + user1Token))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/users/{userId}/follow", user3Id)
                .header("Authorization", "Bearer " + user2Token))
                .andExpect(status().isOk());

        // User2 cria um post
        Map<String, Object> post1Data = new HashMap<>();
        post1Data.put("content", "Primeiro post do User2");
        post1Data.put("type", "TEXT");
        post1Data.put("public", true);

        mockMvc.perform(post("/api/posts")
                .header("Authorization", "Bearer " + user2Token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(post1Data)))
                .andExpect(status().isCreated());

        // User3 cria um post
        Map<String, Object> post2Data = new HashMap<>();
        post2Data.put("content", "Post do User3 que User1 não deve ver");
        post2Data.put("type", "TEXT");
        post2Data.put("public", true);

        mockMvc.perform(post("/api/posts")
                .header("Authorization", "Bearer " + user3Token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(post2Data)))
                .andExpect(status().isCreated());

        // Feed do User1 deve mostrar apenas posts do User2 (que ele segue)
        mockMvc.perform(get("/api/feed")
                .header("Authorization", "Bearer " + user1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.content[0].author.name").value("Usuário Social 2"));

        // Feed do User2 deve mostrar posts do User3
        mockMvc.perform(get("/api/feed")
                .header("Authorization", "Bearer " + user2Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(greaterThanOrEqualTo(1))));

        // Feed público deve mostrar todos os posts públicos
        mockMvc.perform(get("/api/feed/public")
                .header("Authorization", "Bearer " + user1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(greaterThanOrEqualTo(2))));

        // Feed com paginação
        mockMvc.perform(get("/api/feed?page=0&size=1")
                .header("Authorization", "Bearer " + user1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.pageable.pageSize").value(1));
    }

    @Test
    @Order(4)
    void deveImplementarSistemaDeNotificacoes() throws Exception {
        // User1 segue User2 - deve gerar notificação para User2
        mockMvc.perform(post("/api/users/{userId}/follow", user2Id)
                .header("Authorization", "Bearer " + user1Token))
                .andExpect(status().isOk());

        // User2 cria um post
        Map<String, Object> postData = new HashMap<>();
        postData.put("content", "Post para gerar notificações");
        postData.put("type", "TEXT");
        postData.put("public", true);

        MvcResult postResult = mockMvc.perform(post("/api/posts")
                .header("Authorization", "Bearer " + user2Token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(postData)))
                .andExpect(status().isCreated())
                .andReturn();

        Map<String, Object> postJson = objectMapper.readValue(
            postResult.getResponse().getContentAsString(), Map.class);
        String notificationPostId = postJson.get("id").toString();

        // User1 curte o post - deve gerar notificação para User2
        mockMvc.perform(post("/api/posts/{postId}/like", notificationPostId)
                .header("Authorization", "Bearer " + user1Token))
                .andExpect(status().isOk());

        // User1 comenta no post - deve gerar notificação para User2
        Map<String, Object> commentData = new HashMap<>();
        commentData.put("text", "Comentário que gera notificação");

        mockMvc.perform(post("/api/posts/{postId}/comments", notificationPostId)
                .header("Authorization", "Bearer " + user1Token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(commentData)))
                .andExpect(status().isCreated());

        // User2 verifica suas notificações
        mockMvc.perform(get("/api/notifications")
                .header("Authorization", "Bearer " + user2Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(greaterThanOrEqualTo(3)))) // follow, like, comment
                .andExpect(jsonPath("$.unreadCount").value(greaterThanOrEqualTo(3)));

        // User2 marca uma notificação como lida
        mockMvc.perform(get("/api/notifications")
                .header("Authorization", "Bearer " + user2Token))
                .andExpect(status().isOk())
                .andReturn();

        // User2 marca todas como lidas
        mockMvc.perform(post("/api/notifications/mark-all-read")
                .header("Authorization", "Bearer " + user2Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Todas as notificações foram marcadas como lidas"));

        // Verificar que não há mais notificações não lidas
        mockMvc.perform(get("/api/notifications")
                .header("Authorization", "Bearer " + user2Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.unreadCount").value(0));
    }

    @Test
    @Order(5)
    void deveBuscarEFiltrarUsuarios() throws Exception {
        // Buscar usuários por nome
        mockMvc.perform(get("/api/users/search?query=Social")
                .header("Authorization", "Bearer " + user1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(3))) // Todos têm "Social" no nome
                .andExpect(jsonPath("$.content[0].name").value(containsString("Social")));

        // Buscar usuário específico
        mockMvc.perform(get("/api/users/search?query=Social 2")
                .header("Authorization", "Bearer " + user1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].name").value("Usuário Social 2"));

        // Buscar usuários próximos (simulando localização)
        mockMvc.perform(get("/api/users/nearby?lat=-23.5505&lng=-46.6333&radius=10")
                .header("Authorization", "Bearer " + user1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());

        // Sugestões de usuários para seguir
        mockMvc.perform(get("/api/users/suggestions")
                .header("Authorization", "Bearer " + user1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());

        // Ranking de usuários mais ativos
        mockMvc.perform(get("/api/users/ranking?period=week")
                .header("Authorization", "Bearer " + user1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    @Order(6)
    void deveGerenciarPrivacidadeEBloqueios() throws Exception {
        // User1 bloqueia User3
        mockMvc.perform(post("/api/users/{userId}/block", user3Id)
                .header("Authorization", "Bearer " + user1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.blocked").value(true))
                .andExpect(jsonPath("$.message").value("Usuário bloqueado com sucesso"));

        // User3 tenta seguir User1 - deve falhar
        mockMvc.perform(post("/api/users/{userId}/follow", user1Id)
                .header("Authorization", "Bearer " + user3Token))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").value(containsString("Usuário bloqueado")));

        // User3 não deve ver posts de User1
        mockMvc.perform(get("/api/users/{userId}/posts", user1Id)
                .header("Authorization", "Bearer " + user3Token))
                .andExpect(status().isForbidden());

        // User1 desbloqueia User3
        mockMvc.perform(delete("/api/users/{userId}/block", user3Id)
                .header("Authorization", "Bearer " + user1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.blocked").value(false));

        // Agora User3 pode seguir User1
        mockMvc.perform(post("/api/users/{userId}/follow", user1Id)
                .header("Authorization", "Bearer " + user3Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.following").value(true));

        // Configurar perfil como privado
        Map<String, Object> privacyData = new HashMap<>();
        privacyData.put("privateProfile", true);
        privacyData.put("showWorkouts", false);
        privacyData.put("showFollowers", false);

        mockMvc.perform(put("/api/users/privacy")
                .header("Authorization", "Bearer " + user1Token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(privacyData)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.privateProfile").value(true));

        // Listar usuários bloqueados
        mockMvc.perform(get("/api/users/blocked")
                .header("Authorization", "Bearer " + user1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    @Order(7)
    void deveImplementarInteracoesComplexas() throws Exception {
        // Cenário: User1 e User2 seguem um ao outro
        mockMvc.perform(post("/api/users/{userId}/follow", user2Id)
                .header("Authorization", "Bearer " + user1Token))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/users/{userId}/follow", user1Id)
                .header("Authorization", "Bearer " + user2Token))
                .andExpect(status().isOk());

        // User1 cria um post compartilhando um treino
        Map<String, Object> workoutPostData = new HashMap<>();
        workoutPostData.put("content", "Acabei de bater meu recorde pessoal! 🏋️‍♂️");
        workoutPostData.put("type", "WORKOUT");
        workoutPostData.put("workoutId", "123"); // ID fictício de treino
        workoutPostData.put("public", true);

        MvcResult workoutPostResult = mockMvc.perform(post("/api/posts")
                .header("Authorization", "Bearer " + user1Token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(workoutPostData)))
                .andExpect(status().isCreated())
                .andReturn();

        Map<String, Object> workoutPostJson = objectMapper.readValue(
            workoutPostResult.getResponse().getContentAsString(), Map.class);
        String workoutPostId = workoutPostJson.get("id").toString();

        // User2 compartilha o post de User1
        Map<String, Object> shareData = new HashMap<>();
        shareData.put("originalPostId", workoutPostId);
        shareData.put("content", "Inspirador! Vou tentar também 💪");
        shareData.put("type", "SHARE");

        mockMvc.perform(post("/api/posts")
                .header("Authorization", "Bearer " + user2Token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(shareData)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.type").value("SHARE"))
                .andExpect(jsonPath("$.originalPost").exists());

        // User3 salva o post original nos favoritos
        mockMvc.perform(post("/api/posts/{postId}/save", workoutPostId)
                .header("Authorization", "Bearer " + user3Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.saved").value(true));

        // User3 lista seus posts salvos
        mockMvc.perform(get("/api/posts/saved")
                .header("Authorization", "Bearer " + user3Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].id").value(workoutPostId));

        // User1 reporta um comentário inadequado (simulando moderação)
        Map<String, Object> reportData = new HashMap<>();
        reportData.put("reason", "INAPPROPRIATE_CONTENT");
        reportData.put("description", "Comentário ofensivo");

        mockMvc.perform(post("/api/posts/{postId}/report", workoutPostId)
                .header("Authorization", "Bearer " + user1Token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reportData)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Denúncia enviada com sucesso"));

        // Estatísticas sociais do usuário
        mockMvc.perform(get("/api/users/{userId}/stats", user1Id)
                .header("Authorization", "Bearer " + user1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalPosts").value(greaterThanOrEqualTo(1)))
                .andExpect(jsonPath("$.totalLikes").exists())
                .andExpect(jsonPath("$.totalComments").exists())
                .andExpect(jsonPath("$.followersCount").exists())
                .andExpect(jsonPath("$.followingCount").exists());
    }
} 