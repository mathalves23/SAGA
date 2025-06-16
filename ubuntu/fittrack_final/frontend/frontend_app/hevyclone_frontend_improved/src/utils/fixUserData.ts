// Utilitário para corrigir dados incorretos do usuário
export const fixUserData = () => {
  try {
    // Corrigir dados do AuthContext
    const savedUser = localStorage.getItem('saga-user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      if (userData.email === 'usuario@saga.com') {
        userData.email = 'matheus.aalves@hotmail.com';
        userData.name = 'Matheus Alves';
        localStorage.setItem('saga-user', JSON.stringify(userData));
        console.log('Dados do AuthContext corrigidos');
      }
    }

    // Corrigir dados do Profile
    const savedProfile = localStorage.getItem('user_profile');
    if (savedProfile) {
      const profileData = JSON.parse(savedProfile);
      if (profileData.email === 'usuario@saga.com') {
        profileData.email = 'matheus.aalves@hotmail.com';
        if (!profileData.name || profileData.name === 'mathalves') {
          profileData.name = 'Matheus Alves';
        }
        localStorage.setItem('user_profile', JSON.stringify(profileData));
        console.log('Dados do Profile corrigidos');
      }
    }

    console.log('Verificação e correção de dados concluída');
  } catch (error) {
    console.error('Erro ao corrigir dados:', error);
  }
}; 