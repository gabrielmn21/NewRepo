// Elementos da DOM
const productsSection = document.getElementById('products-section');
const profileSection = document.getElementById('profile-section');
const viewProductsBtn = document.getElementById('view-products');
const viewProfileBtn = document.getElementById('view-profile');
const productsList = document.getElementById('products-list');
const userInfoDiv = document.getElementById('user-info');

// Alternar entre seções
viewProductsBtn.addEventListener('click', () => {
    productsSection.style.display = 'block';
    profileSection.style.display = 'none';
});

viewProfileBtn.addEventListener('click', () => {
    productsSection.style.display = 'none';
    profileSection.style.display = 'block';
});

// Carregar dados do usuário
function loadUserData(userId) {
    db.collection('users').doc(userId).get()
        .then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                userInfoDiv.innerHTML = `
          <h3>${userData.name}</h3>
          <p><strong>Email:</strong> ${userData.email}</p>
          <p><strong>Membro desde:</strong> ${new Date(userData.createdAt?.toDate()).toLocaleDateString()}</p>
        `;
            }
        })
        .catch((error) => {
            console.error("Erro ao carregar dados do usuário:", error);
        });
}

// Carregar produtos
function loadProducts() {
    productsList.innerHTML = ''; // Limpa a lista

    db.collection('products').get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                // Se não houver produtos, adiciona alguns exemplos
                addSampleProducts();
                return;
            }

            querySnapshot.forEach((doc) => {
                const product = doc.data();
                addProductToDOM(doc.id, product);
            });
        })
        .catch((error) => {
            console.error("Erro ao carregar produtos:", error);
        });
}

// Adicionar produto ao DOM
function addProductToDOM(id, product) {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.innerHTML = `
    <img src="${product.image || 'https://via.placeholder.com/250'}" alt="${product.name}">
    <div class="product-info">
      <h3>${product.name}</h3>
      <p>${product.description || ''}</p>
      <p class="price">R$ ${product.price.toFixed(2)}</p>
    </div>
  `;
    productsList.appendChild(productCard);
}

// Adicionar produtos de exemplo (apenas se a coleção estiver vazia)
function addSampleProducts() {
    const sampleProducts = [
        {
            name: "Smartphone Premium",
            description: "O mais recente smartphone com câmera de 108MP",
            price: 3999.99,
            image: "https://via.placeholder.com/250?text=Smartphone"
        },
        {
            name: "Notebook Ultra Slim",
            description: "Notebook leve e potente para trabalho e diversão",
            price: 5499.99,
            image: "https://via.placeholder.com/250?text=Notebook"
        },
        {
            name: "Fones de Ouvido Sem Fio",
            description: "Cancelamento de ruído e som de alta qualidade",
            price: 899.99,
            image: "https://via.placeholder.com/250?text=Fones"
        },
        {
            name: "Smartwatch Inteligente",
            description: "Monitoramento de saúde e notificações do smartphone",
            price: 1299.99,
            image: "https://via.placeholder.com/250?text=Smartwatch"
        }
    ];

    sampleProducts.forEach((product, index) => {
        db.collection('products').add(product)
            .then((docRef) => {
                addProductToDOM(docRef.id, product);
            })
            .catch((error) => {
                console.error("Erro ao adicionar produto:", error);
            });
    });
}