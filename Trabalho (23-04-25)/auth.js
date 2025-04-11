// Elementos da DOM
const loginPage = document.getElementById('login-page');
const registerPage = document.getElementById('register-page');
const verifyPage = document.getElementById('verify-page');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const verifyForm = document.getElementById('verify-form');
const showRegister = document.getElementById('show-register');
const showLogin = document.getElementById('show-login');
const logoutBtn = document.getElementById('logout');
const deleteAccountBtn = document.getElementById('delete-account');

// Alternar entre páginas de autenticação
showRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginPage.style.display = 'none';
    registerPage.style.display = 'block';
});

showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    registerPage.style.display = 'none';
    loginPage.style.display = 'block';
});

// Login com email/senha
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            if (!user.emailVerified) {
                // Se o email não estiver verificado, solicita verificação
                showVerifyPage(user);
            } else {
                // Se estiver verificado, mostra o dashboard
                showDashboard(user);
            }
        })
        .catch((error) => {
            document.getElementById('login-error').textContent = error.message;
        });
});

// Registro de novo usuário
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            // Envia email de verificação
            return user.sendEmailVerification()
                .then(() => {
                    // Salva informações adicionais do usuário no Firestore
                    return db.collection('users').doc(user.uid).set({
                        name: name,
                        email: email,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                })
                .then(() => {
                    showVerifyPage(user);
                });
        })
        .catch((error) => {
            document.getElementById('register-error').textContent = error.message;
        });
});

// Verificação de email (2FA simples)
verifyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    // Recarrega o usuário para verificar se o email foi verificado
    user.reload().then(() => {
        if (user.emailVerified) {
            showDashboard(user);
        } else {
            document.getElementById('verify-error').textContent = 'Email ainda não verificado. Verifique sua caixa de entrada.';
        }
    });
});

// Logout
logoutBtn.addEventListener('click', () => {
    auth.signOut().then(() => {
        loginPage.style.display = 'block';
        dashboard.style.display = 'none';
        verifyPage.style.display = 'none';
        registerPage.style.display = 'none';
    });
});

// Excluir conta
deleteAccountBtn.addEventListener('click', () => {
    if (confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
        const user = auth.currentUser;

        // Primeiro exclui os dados do Firestore
        db.collection('users').doc(user.uid).delete()
            .then(() => {
                // Depois exclui a conta de autenticação
                return user.delete();
            })
            .then(() => {
                alert('Conta excluída com sucesso.');
                loginPage.style.display = 'block';
                dashboard.style.display = 'none';
            })
            .catch((error) => {
                alert('Erro ao excluir conta: ' + error.message);
            });
    }
});

// Mostrar página de verificação
function showVerifyPage(user) {
    loginPage.style.display = 'none';
    registerPage.style.display = 'none';
    dashboard.style.display = 'none';
    verifyPage.style.display = 'block';

    // Atualiza o email mostrado na página de verificação
    document.getElementById('verify-email').textContent = user.email;
}

// Mostrar dashboard
function showDashboard(user) {
    loginPage.style.display = 'none';
    registerPage.style.display = 'none';
    verifyPage.style.display = 'none';
    dashboard.style.display = 'block';

    // Carrega os dados do usuário e produtos
    loadUserData(user.uid);
    loadProducts();
}

// Observador de estado de autenticação
auth.onAuthStateChanged((user) => {
    if (user) {
        if (user.emailVerified) {
            showDashboard(user);
        } else {
            showVerifyPage(user);
        }
    } else {
        loginPage.style.display = 'block';
        dashboard.style.display = 'none';
        verifyPage.style.display = 'none';
        registerPage.style.display = 'none';
    }
});
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log("Formulário de registro submetido"); // Adicione este log

    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    console.log("Dados capturados:", { name, email, password }); // Verifique os dados

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log("Usuário criado com sucesso", userCredential.user); // Log de sucesso
            const user = userCredential.user;

            return user.sendEmailVerification()
                .then(() => {
                    console.log("Email de verificação enviado");
                    return db.collection('users').doc(user.uid).set({
                        name: name,
                        email: email,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                })
                .then(() => {
                    console.log("Dados do usuário salvos no Firestore");
                    showVerifyPage(user);
                });
        })
        .catch((error) => {
            console.error("Erro no registro:", error); // Log detalhado do erro
            document.getElementById('register-error').textContent = error.message;
        });
});
// Adicione estas variáveis globais no início do arquivo
let verificationCode = null;
let verificationEmail = null;
let passwordResetCode = null;

// Modifique a função de registro
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        // Gera código de verificação (6 dígitos)
        verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        verificationEmail = email;

        // Simula envio do código (em produção, use um serviço de e-mail)
        console.log(`Código de verificação para ${email}: ${verificationCode}`);
        alert(`DEMO: Código de verificação enviado para ${email}: ${verificationCode}`);

        // Mostra página de verificação
        showVerifyPage({ email });

    } catch (error) {
        document.getElementById('register-error').textContent = error.message;
    }
});

// Modifique a função de verificação
verifyForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userCode = document.getElementById('verify-code').value;

    if (userCode !== verificationCode) {
        document.getElementById('verify-error').textContent = 'Código inválido. Por favor, tente novamente.';
        // Limpa o código para segurança
        verificationCode = null;
        // Volta para o início
        loginPage.style.display = 'block';
        verifyPage.style.display = 'none';
        registerPage.style.display = 'none';
        return;
    }

    try {
        // Se estiver verificando um registro
        if (verificationEmail) {
            const name = document.getElementById('register-name').value;
            const password = document.getElementById('register-password').value;

            // Cria o usuário após verificação bem-sucedida
            const userCredential = await auth.createUserWithEmailAndPassword(verificationEmail, password);

            // Salva dados adicionais
            await db.collection('users').doc(userCredential.user.uid).set({
                name: name,
                email: verificationEmail,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            showDashboard(userCredential.user);
        }
        // Se estiver verificando uma recuperação de senha
        else if (passwordResetEmail) {
            const newPassword = document.getElementById('reset-new-password').value;
            await auth.signInWithEmailAndPassword(passwordResetEmail, tempPassword);
            const user = auth.currentUser;
            await user.updatePassword(newPassword);

            alert('Senha alterada com sucesso!');
            loginPage.style.display = 'block';
            resetPage.style.display = 'none';
        }

    } catch (error) {
        document.getElementById('verify-error').textContent = error.message;
    }
});

// Adicione esta função para recuperação de senha
function setupPasswordReset() {
    const resetForm = document.getElementById('reset-form');
    const showReset = document.getElementById('show-reset');
    const resetEmailPage = document.getElementById('reset-email-page');
    const resetCodePage = document.getElementById('reset-code-page');
    const resetNewPassPage = document.getElementById('reset-newpass-page');
    let passwordResetEmail = null;
    let tempPassword = null;

    // Mostrar página de recuperação
    showReset.addEventListener('click', (e) => {
        e.preventDefault();
        loginPage.style.display = 'none';
        resetEmailPage.style.display = 'block';
    });

    // Enviar código de recuperação
    resetForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        passwordResetEmail = document.getElementById('reset-email').value;

        try {
            // Verifica se o email existe
            await auth.fetchSignInMethodsForEmail(passwordResetEmail);

            // Gera código e senha temporária
            passwordResetCode = Math.floor(100000 + Math.random() * 900000).toString();
            tempPassword = Math.random().toString(36).slice(-8);

            console.log(`Código de recuperação para ${passwordResetEmail}: ${passwordResetCode}`);
            console.log(`Senha temporária: ${tempPassword}`);
            alert(`DEMO: Código de recuperação: ${passwordResetCode}\nSenha temporária: ${tempPassword}`);

            resetEmailPage.style.display = 'none';
            resetCodePage.style.display = 'block';

        } catch (error) {
            document.getElementById('reset-error').textContent = 'Email não encontrado.';
        }
    });

    // Verificar código de recuperação
    document.getElementById('verify-reset-code').addEventListener('click', async () => {
        const userCode = document.getElementById('reset-code').value;

        if (userCode !== passwordResetCode) {
            document.getElementById('reset-code-error').textContent = 'Código inválido.';
            return;
        }

        resetCodePage.style.display = 'none';
        resetNewPassPage.style.display = 'block';
    });

    // Atualizar senha
    document.getElementById('new-pass-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const newPassword = document.getElementById('reset-new-password').value;
        const confirmPassword = document.getElementById('reset-confirm-password').value;

        if (newPassword !== confirmPassword) {
            document.getElementById('reset-newpass-error').textContent = 'As senhas não coincidem.';
            return;
        }

        try {
            // Usa a senha temporária para autenticar
            await auth.signInWithEmailAndPassword(passwordResetEmail, tempPassword);
            const user = auth.currentUser;
            await user.updatePassword(newPassword);

            alert('Senha alterada com sucesso!');
            resetNewPassPage.style.display = 'none';
            loginPage.style.display = 'block';

        } catch (error) {
            document.getElementById('reset-newpass-error').textContent = error.message;
        }
    });
}

// Chame esta função no final do arquivo
setupPasswordReset();