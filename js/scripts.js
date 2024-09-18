const firebaseConfig = {
  apiKey: "AIzaSyDMsK6qFYqW3Tmz5hhkVx3fHhp0KMT066k",
  authDomain: "seeker-pubs.firebaseapp.com",
  projectId: "seeker-pubs",
  storageBucket: "seeker-pubs.appspot.com",
  messagingSenderId: "299279593372",
  appId: "1:299279593372:web:af17168511198bbb032259",
  measurementId: "G-BVFSSD8LYW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Elementos DOM
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const postBtn = document.getElementById('post-btn');
const postContent = document.getElementById('post-content');
const postsFeed = document.getElementById('posts-feed');
const postContainer = document.querySelector('.post-container');

// Função de cadastro
signupBtn.addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      const user = userCredential.user;
      alert("Cadastro realizado com sucesso!");
      
      // Salvar no Firestore
      db.collection('users').doc(user.uid).set({
        email: user.email,
        isBanned: false
      });
      
      // Mostrar área de postagens
      postContainer.style.display = 'block';
    })
    .catch(error => {
      alert('Erro no cadastro: ' + error.message);
    });
});

// Função de login
loginBtn.addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      const user = userCredential.user;
      
      // Verificar se o usuário está banido
      db.collection('users').doc(user.uid).get().then(doc => {
        if (doc.exists && doc.data().isBanned) {
          alert("Você foi banido!");
          auth.signOut();
        } else {
          alert("Login realizado com sucesso!");
          postContainer.style.display = 'block';
          carregarPosts();
        }
      });
    })
    .catch(error => {
      alert('Erro no login: ' + error.message);
    });
});

// Função para publicar post
postBtn.addEventListener('click', () => {
  const user = auth.currentUser;
  
  if (user && postContent.value.trim()) {
    db.collection('posts').add({
      content: postContent.value,
      userId: user.uid,
      userName: user.email,
      likes: 0,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
      alert('Postagem criada!');
      postContent.value = '';
      carregarPosts();
    }).catch(error => {
      alert('Erro ao publicar: ' + error.message);
    });
  } else {
    alert("Por favor, escreva algo antes de postar.");
  }
});

// Função para carregar postagens
function carregarPosts() {
  db.collection('posts').orderBy('createdAt', 'desc').onSnapshot(querySnapshot => {
    postsFeed.innerHTML = '';
    
    querySnapshot.forEach(doc => {
      const post = doc.data();
      const postId = doc.id;
      
      const postElement = document.createElement('div');
      postElement.classList.add('post');
      postElement.innerHTML = `
        <p><strong>${post.userName}</strong>: ${post.content}</p>
        <p>Curtidas: ${post.likes}</p>
        <button onclick="curtirPost('${postId}')">Curtir</button>
      `;
      
      postsFeed.appendChild(postElement);
    });
  });
}

// Função para curtir um post
function curtirPost(postId) {
  const postRef = db.collection('posts').doc(postId);
  
  postRef.get().then(doc => {
    if (doc.exists) {
      const currentLikes = doc.data().likes;
      postRef.update({ likes: currentLikes + 1 });
    }
  });
}

