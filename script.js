// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBSkXYIFPEJ2mWj2LFK7t4N76zftGEzoFw",
  authDomain: "sample-d6924.firebaseapp.com",
  projectId: "sample-d6924",
  storageBucket: "sample-d6924.firebasestorage.app",
  messagingSenderId: "597435177559",
  appId: "1:597435177559:web:3ad87d2aa4b94417f2a112",
  measurementId: "G-1J6EQX1W77"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = firebase.auth();
const db = firebase.firestore();

// (Firebase初期化コードは上記に記述済み)

function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
  
    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // ログイン成功
        const user = userCredential.user;
        console.log('ログイン成功:', user);
        errorMessage.textContent = ''; // エラーメッセージをクリア
        // 商品一覧画面へリダイレクト (まだ作成していないため、alertを表示)
        // alert('ログイン成功！商品一覧画面へ遷移します (未実装)');
        window.location.href = 'product_list.html'; // コメントアウト
      })
      .catch((error) => {
        // エラー処理
        const errorCode = error.code;
        const errorMessageText = error.message;
        console.error('ログイン失敗:', errorCode, errorMessageText);
        errorMessage.textContent = errorMessageText;
      });
  }

  function logout() {
    auth.signOut().then(() => {
      // ログアウト成功
      console.log('ログアウト成功');
      // ログイン画面へリダイレクト
      window.location.href = 'index.html';
    }).catch((error) => {
      // エラー処理
      console.error('ログアウト失敗:', error);
    });
  }
  
  // ログイン状態の監視 (必要に応じて)
  auth.onAuthStateChanged((user) => {
    if (user) {
      // ユーザーがログインしている
      console.log('ログイン中のユーザー:', user);
      // 必要に応じてUIを更新
    } else {
      // ユーザーがログアウトしている
      console.log('ユーザーはログアウトしています');
      // 必要に応じてログイン画面へリダイレクト
      // window.location.href = 'index.html';
    }
  });  
// (Firebase初期化コード、login() 関数、logout() 関数、onAuthStateChanged() は記述済み)

function displayProducts(products) {
    const productListDiv = document.getElementById('product-list');
    productListDiv.innerHTML = ''; // 既存の表示をクリア
  
    products.forEach(product => {
      const productDiv = document.createElement('div');
      productDiv.classList.add('product-item');
      productDiv.innerHTML = `
        <h3>${product.name}</h3>
        <p>価格: ${product.price}円</p>
        <button onclick="showProductDetail('${product.id}')">詳細を見る</button>
      `;
      productListDiv.appendChild(productDiv);
    });
  }
  
  function getProducts() {
    db.collection('products').get()
      .then((querySnapshot) => {
        const products = [];
        querySnapshot.forEach((doc) => {
          products.push({ id: doc.id, ...doc.data() });
        });
        displayProducts(products);
      })
      .catch((error) => {
        console.error('商品データの取得に失敗しました:', error);
      });
  }
  
  // ページ読み込み時に商品一覧を取得 (ログイン状態の監視内で実行)
  auth.onAuthStateChanged((user) => {
    const path = window.location.pathname;
  
    if (path.includes('product_list.html')) {
      if (user) {
        // ログイン済みであれば商品データを取得
        getProducts();
      } else {
        window.location.href = 'index.html';
      }
    } else if (path.includes('product_detail.html')) {
      if (!user) {
        window.location.href = 'index.html';
      }
    } else if (path.includes('index.html')) {
      if (user) {
        window.location.href = 'product_list.html';
      }
    }
  });

  function showProductDetail(productId) {
    window.location.href = `product_detail.html?id=${productId}`;
  }

  function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
  }
  
  function displayProductDetail(product) {
    const productDetailDiv = document.getElementById('product-detail');
    if (product) {
      productDetailDiv.innerHTML = `
        <h3>${product.name}</h3>
        <p>価格: ${product.price}円</p>
        <p>${product.description}</p>
        <img src="${product.imageUrl}" alt="${product.name}">
      `;
    } else {
      productDetailDiv.innerHTML = '<p>商品が見つかりません。</p>';
    }
  }
  
  function getProductDetail(productId) {
    db.collection('products').doc(productId).get()
      .then((doc) => {
        if (doc.exists) {
          displayProductDetail(doc.data());
        } else {
          console.log('No such document!');
          displayProductDetail(null);
        }
      })
      .catch((error) => {
        console.error('商品詳細の取得に失敗しました:', error);
        displayProductDetail(null);
      });
  }
  
  auth.onAuthStateChanged((user) => {
    const path = window.location.pathname;
  
    if (path.includes('product_list.html')) {
      if (user) {
        getProducts();
      } else {
        window.location.href = 'index.html';
      }
    } else if (path.includes('product_detail.html')) {
      if (user) {
        const productId = getProductIdFromUrl();
        if (productId) {
          getProductDetail(productId);
        } else {
          // IDがない場合は一覧に戻るなどの処理
          window.location.href = 'product_list.html';
        }
      } else {
        window.location.href = 'index.html';
      }
    } else if (path.includes('index.html')) {
      if (user) {
        window.location.href = 'product_list.html';
      }
    }
  });
  